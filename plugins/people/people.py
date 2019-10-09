# -*- coding: utf-8 -*-

# Copyright © 2012-2014 Giovanni Beltrame and others.

# Permission is hereby granted, free of charge, to any
# person obtaining a copy of this software and associated
# documentation files (the "Software"), to deal in the
# Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the
# Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice
# shall be included in all copies or substantial portions of
# the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
# KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
# WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
# PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
# OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
# OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
# OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from __future__ import unicode_literals

import uuid
import os

from docutils import nodes
from docutils.parsers.rst import Directive, directives

from nikola.plugin_categories import RestExtension

from configparser import * 

class Plugin(RestExtension):

    name = "rest_people"

    def set_site(self, site):
        self.site = site
        directives.register_directive('people', People)
        People.site = site
        return super(Plugin, self).set_site(site)

class People(Directive):
    """ Restructured text extension for inserting a table of people."""
    has_content = True

    def run(self):
        if len(self.content) == 0:
            return

        if self.site.invariant:  # for testing purposes
            table_id = 'people_' + 'fixedvaluethatisnotauuid'
        else:
            table_id = 'people_' + uuid.uuid4().hex

        # Find people
        base = self.content[0]
        ppl = os.listdir(base)
        people = list()
        alumni = list()

        # Sort alphabetically
        ppl.sort(key=lambda x: x[1:])

        # Make the director the first name
        ppl.insert(0,ppl.pop(ppl.index('beltrame')))

        # Collect people information
        for p in ppl:
            person_path = os.path.join(base,p)
            
            # Find ini file
            if not os.path.isfile(person_path+"/person.ini"):
                continue
            
            cr = ConfigParser()
            cr.read(person_path+"/person.ini")
            person = cr['Person']

            if 'href' not in person:
                person['href'] = "/people/"+p+"/"
            if 'Image' not in person:
                person['Image']='http://placecreature.com/750/450'

            if 'Alumnus' in person:
                alumni.append(person)
            else:
                people.append(person)
                

        output = self.site.template_system.render_template(
            'people.tmpl',
            None,
            {
                'people': people,
                'alumni' : alumni,
                'table_id': table_id,
            }
        )
        return [nodes.raw('', output, format='html')]


directives.register_directive('people', People)
