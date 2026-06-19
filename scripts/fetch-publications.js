#!/usr/bin/env node
// Fetches publications from the ORCID public API for every faculty member
// (role: faculty) who has an `orcid:` field in their src/people/*.md file.
// For each work that has a DOI, the full author list is pulled from Crossref
// (ORCID work summaries almost never include contributors). Results are
// deduplicated, year-sorted, and written to _data/publications.json.
//
// The file is only rewritten when the publication list actually changes, so
// the weekly GitHub Action does not create empty commits.
//
// Run: npm run fetch-pubs   (or: node scripts/fetch-publications.js)

const fs = require('fs');
const path = require('path');
const https = require('https');
const yaml = require('js-yaml');

const PEOPLE_DIR = path.join(__dirname, '../src/people');
const OUTPUT_FILE = path.join(__dirname, '../_data/publications.json');
const ORCID_BASE = 'https://pub.orcid.org/v3.0';
const CROSSREF_BASE = 'https://api.crossref.org/works';
// Crossref "polite pool" wants a contact in the User-Agent.
const USER_AGENT = 'MISTLab-website/1.0 (https://mistlab.ca; mailto:info@mistlab.ca)';
const MAX_AUTHORS = 15; // collapse to "et al." beyond this many

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { Accept: 'application/json', 'User-Agent': USER_AGENT }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

// Read role:faculty members with an orcid from the per-person markdown files.
function loadFaculty() {
  const faculty = [];
  for (const file of fs.readdirSync(PEOPLE_DIR)) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;
    const raw = fs.readFileSync(path.join(PEOPLE_DIR, file), 'utf8');
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) continue;
    let fm;
    try { fm = yaml.load(m[1]); } catch { continue; }
    if (fm && fm.role === 'faculty' && fm.orcid) {
      faculty.push({ name: fm.name, orcid: String(fm.orcid).trim() });
    }
  }
  return faculty;
}

function normTitle(t) {
  return (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// "Pierre-Yves Lajoie" -> "P.-Y. Lajoie"; organizations kept as-is.
function formatAuthor(a) {
  if (!a) return '';
  if (a.name) return a.name.trim(); // organization / consortium
  const family = (a.family || '').trim();
  const given = (a.given || '').trim();
  if (!given) return family;
  const initials = given
    .split(/\s+/)
    .map(part => part.split('-').map(s => s ? s[0].toUpperCase() + '.' : '').join('-'))
    .join(' ');
  return (initials + ' ' + family).trim();
}

// Full author list for a DOI via Crossref, or null on failure / no data.
async function fetchCrossrefAuthors(doi) {
  try {
    const data = await get(`${CROSSREF_BASE}/${encodeURIComponent(doi)}`);
    const authors = data?.message?.author || [];
    const names = authors.map(formatAuthor).filter(Boolean);
    if (names.length === 0) return null;
    if (names.length > MAX_AUTHORS) {
      return names.slice(0, MAX_AUTHORS - 3).join(', ') + ', et al.';
    }
    return names.join(', ');
  } catch {
    return null;
  }
}

function extractPub(workSummary, profName) {
  const title = workSummary?.title?.title?.value || '';
  if (!title) return null;

  const year = workSummary?.['publication-date']?.year?.value || '';
  const venue = workSummary?.['journal-title']?.value || '';

  let doiUrl = '';
  let doiBare = '';
  const ids = workSummary?.['external-ids']?.['external-id'] || [];
  for (const id of ids) {
    if (id['external-id-type'] === 'doi') {
      doiBare = id['external-id-value'];
      doiUrl = 'https://doi.org/' + doiBare;
      break;
    }
  }

  // Fallback used only when Crossref has no author data (or there's no DOI).
  const contributors = workSummary?.contributors?.contributor || [];
  let authors = profName + ' et al.';
  if (contributors.length > 0) {
    const first = contributors[0]?.['credit-name']?.value;
    if (first) authors = first + (contributors.length > 1 ? ' et al.' : '');
  }

  return { title, year, venue, doi: doiUrl, doiBare, authors };
}

async function fetchForOrcid(orcidId, profName) {
  console.log(`  Fetching works for ${profName} (${orcidId})...`);
  const data = await get(`${ORCID_BASE}/${orcidId}/works`);
  const groups = data.group || [];
  const pubs = [];
  for (const group of groups) {
    const summary = group?.['work-summary']?.[0];
    if (!summary) continue;
    const pub = extractPub(summary, profName);
    if (pub) pubs.push({ ...pub, source_orcid: orcidId });
  }
  console.log(`  ✓ ${pubs.length} works found for ${profName}`);
  return pubs;
}

async function main() {
  const faculty = loadFaculty();

  if (faculty.length === 0) {
    console.log('No faculty members with ORCID IDs found in src/people/*.md.');
    console.log('Add an `orcid:` field to a faculty member to enable auto-fetching.');
    process.exit(0);
  }

  console.log(`Fetching publications for ${faculty.length} faculty member(s)...`);

  const allPubs = [];
  const seenTitles = new Set();
  const seenDois = new Set();
  let okCount = 0;

  for (const person of faculty) {
    let pubs;
    try {
      pubs = await fetchForOrcid(person.orcid, person.name);
      okCount++;
    } catch (err) {
      console.warn(`  ✗ Failed to fetch for ${person.name}: ${err.message}`);
      continue;
    }
    for (const pub of pubs) {
      const doiKey = pub.doiBare ? pub.doiBare.toLowerCase() : '';
      const titleKey = normTitle(pub.title);
      if (doiKey && seenDois.has(doiKey)) continue;
      if (seenTitles.has(titleKey)) continue;
      if (doiKey) seenDois.add(doiKey);
      seenTitles.add(titleKey);
      allPubs.push(pub);
    }
  }

  // If every ORCID fetch failed, leave the existing file untouched.
  if (okCount === 0) {
    console.error('All ORCID fetches failed — keeping the existing publications.json.');
    process.exit(1);
  }

  // Enrich authors from Crossref for every work that has a DOI.
  const withDoi = allPubs.filter(p => p.doiBare);
  console.log(`\nFetching author lists from Crossref for ${withDoi.length} works...`);
  let enriched = 0;
  for (const pub of withDoi) {
    const authors = await fetchCrossrefAuthors(pub.doiBare);
    if (authors) { pub.authors = authors; enriched++; }
  }
  console.log(`  ✓ ${enriched}/${withDoi.length} enriched (rest keep "PI et al.")`);

  // Drop the helper field; sort by year desc then title.
  for (const p of allPubs) delete p.doiBare;
  allPubs.sort((a, b) => {
    const yearDiff = (b.year || '0').localeCompare(a.year || '0');
    return yearDiff !== 0 ? yearDiff : a.title.localeCompare(b.title);
  });

  // Stability: only rewrite when the publication list actually changed, so the
  // weekly Action doesn't churn the timestamp and create empty commits.
  let previous = null;
  if (fs.existsSync(OUTPUT_FILE)) {
    try { previous = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')); } catch { /* rewrite */ }
  }
  const prevPubs = JSON.stringify(previous?.publications || []);
  const newPubs = JSON.stringify(allPubs);
  if (prevPubs === newPubs) {
    console.log(`\nNo changes — ${allPubs.length} publications already up to date.`);
    return;
  }

  const output = {
    generated_at: new Date().toISOString(),
    total: allPubs.length,
    publications: allPubs
  };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nDone! Wrote ${allPubs.length} deduplicated publications to _data/publications.json`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
