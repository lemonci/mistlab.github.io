from __future__ import unicode_literals

import uuid
import os

from docutils import nodes
from docutils.parsers.rst import Directive, directives

from nikola.plugin_categories import RestExtension

from nikola.utils import get_logger, req_missing, STDERR_HANDLER

logger = get_logger('rest_bibtex', STDERR_HANDLER)

def add_publications(filename):
    """
    Populates context with a list of BibTeX publications.

    Configuration
    -------------
    filename:
        local path to the BibTeX file to read.

    Output
    ------
    publications:
        List of tuples (key, year, text, bibtex, pdf, slides, poster).
    """
    try:
        from StringIO import StringIO
    except ImportError:
        from io import StringIO
    try:
        from pybtex.database.input.bibtex import Parser
        from pybtex.database.output.bibtex import Writer
        from pybtex.database import BibliographyData, PybtexError
        from pybtex.backends import html
        from pybtex.style.formatting import unsrt
    except ImportError:
        logger.warn('`md_bibtex` failed to load dependency `pybtex`')
        return

    refs_file = filename
    try:
        bibdata_all = Parser().parse_file(refs_file)
    except PybtexError as e:
        logger.warn('`md_bibtex` failed to parse file %s: %s' % (
            refs_file,
            str(e)))
        return

    publications = dict()
    pubnumber = 0

    # format entries
    plain_style = unsrt.Style()
    html_backend = html.Backend()
    formatted_entries = plain_style.format_entries(bibdata_all.entries.values())

    for formatted_entry in formatted_entries:
        key = formatted_entry.key
        entry = bibdata_all.entries[key]
        year = entry.fields.get('year')
        pdf = entry.fields.get('pdf', None)
        url = entry.fields.get('url', None)
        slides = entry.fields.get('slides', None)
        poster = entry.fields.get('poster', None)

        #render the bibtex string for the entry
        bib_buf = StringIO()
        bibdata_this = BibliographyData(entries={key: entry})
        Writer().write_stream(bibdata_this, bib_buf)

        # Make sure I'm using an entry without URLs
        et = plain_style.format_entries([entry]);
        print(dir(et))
        text = next(et).text.render(html_backend)

        # Remove the bloody parenthesis
        text = text.replace('{','')
        text = text.replace('}','')

        if year in publications:
            publications[year].append((key,
                             text,
                             bib_buf.getvalue(),
                             pdf,
                             url,
                             slides,
                             poster))
        else:
            publications[year] = [(key,
                             text,
                             bib_buf.getvalue(),
                             pdf,
                             url,
                             slides,
                             poster)]
        pubnumber = pubnumber + 1;

    import collections
    od = collections.OrderedDict(sorted(publications.items(),reverse=True))
    return od

class Plugin(RestExtension):

    name = "rest_bibtex"

    def set_site(self, site):
        self.site = site
        directives.register_directive('bibtex', Bibtex)
        Bibtex.site = site
        return super(Plugin, self).set_site(site)

class Bibtex(Directive):
    """ Restructured text extension for inserting a table of people."""
    has_content = True
    required_arguments = 1

    def run(self):
        if self.content:
            raise self.warning("This directive does not accept content")

        if self.site.invariant:  # for testing purposes
            table_id = 'bibtex_' + 'fixedvaluethatisnotauuid'
        else:
            table_id = 'bibtex_' + uuid.uuid4().hex

        # Find people
        publications = add_publications(self.arguments[0])

        output = self.site.template_system.render_template(
            'biblio.tmpl',
            None,
            {
                'publications': publications,
                'table_id': table_id
            }
        )
        return [nodes.raw('', output, format='html')]


directives.register_directive('bibtex', Bibtex)
