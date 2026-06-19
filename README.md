# MIST Lab Website

The website for the **MIST Lab** at Polytechnique Montréal. Built with
[Eleventy](https://www.11ty.dev/) (a static site generator) and deployed to
GitHub Pages. Almost everything you'll want to change lives in plain **YAML**
data files or **Markdown** member pages — no web development needed.

> **MIST** has no fixed meaning — the homepage cycles through possibilities on
> purpose. Edit the word lists in [`_data/acronym.yaml`](_data/acronym.yaml).

---

## Editing content

| I want to… | Edit this |
| --- | --- |
| Add / edit a lab member | A file in [`src/people/`](src/people/) — see below |
| Move someone to alumni | [`_data/alumni.yaml`](_data/alumni.yaml) (and optionally delete their `src/people/*.md`) |
| Change the rotating MIST words | [`_data/acronym.yaml`](_data/acronym.yaml) |
| Add a news item | [`_data/news.yaml`](_data/news.yaml) |
| Edit research areas | [`_data/projects.yaml`](_data/projects.yaml) |
| Edit courses | [`_data/courses.yaml`](_data/courses.yaml) |
| Edit the missions gallery | [`_data/missions.yaml`](_data/missions.yaml) |
| Edit spin-off companies | [`_data/spinoffs.yaml`](_data/spinoffs.yaml) |
| Change email / address / stats | [`_data/site.yaml`](_data/site.yaml) |

### Add or edit a lab member

Each member is one Markdown file in [`src/people/`](src/people/). The filename
becomes the URL (`monica-li.md` → `/people/monica-li/`).

1. Copy [`src/people/_TEMPLATE.md`](src/people/_TEMPLATE.md) to
   `firstname-lastname.md`.
2. Fill in the front matter at the top (name, `role`, title, links…). The
   `role` field controls which group the person appears under on the People
   page — valid values: `faculty`, `research_associate`, `postdoc`, `phd`,
   `msc`, `intern` (the group order is set in [`_data/roles.yaml`](_data/roles.yaml)).
3. Add a square photo (~600×600) to
   [`assets/images/people/`](assets/images/people/) and point `photo:` at its
   filename. No photo? Delete the `photo:` line and the page shows the person's
   initials.
4. Write the bio below the second `---` in Markdown.

The `_TEMPLATE.md` file never appears on the site (it's excluded in
[`.eleventyignore`](.eleventyignore)).

---

## Publications

The Publications page is generated automatically from
[ORCID](https://orcid.org). You don't edit it by hand.

- It reads the `orcid:` field from each **faculty** member's file in
  `src/people/` and fetches their works from the ORCID public API, deduplicating
  across all three PIs.
- A GitHub Action ([`update-publications.yml`](.github/workflows/update-publications.yml))
  refreshes it **weekly** (Mondays). You can also trigger it manually from the
  repo's **Actions** tab → *Update Publications from ORCID* → *Run workflow*.
- To refresh locally: `npm run fetch-pubs`.

> ORCID profiles are only as complete as each person keeps them. If a PI's
> publication list looks short, they should add their works on
> [orcid.org](https://orcid.org). Google Scholar links on the page cover the
> rest.

---

## Running locally

You need [Node.js](https://nodejs.org/) 18+.

```bash
npm install      # once
npm start        # serves http://localhost:8080 with live reload
npm run build    # one-off build into _site/
```

No Node installed? You can build in Docker instead:

```bash
docker run --rm -v "$PWD":/app -w /app node:20-alpine \
  sh -c "npm install && npx @11ty/eleventy --serve --port 8080"
```

---

## Deployment (GitHub Pages)

1. Push this folder to a GitHub repository (e.g. in the `MISTLab` org).
2. In the repo: **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
3. Pushing to `main` builds and deploys via
   [`deploy.yml`](.github/workflows/deploy.yml).

### One setting that depends on the URL: `PATH_PREFIX`

GitHub Pages serves project repos under a subpath (`username.github.io/REPO/`),
so links must be prefixed. This is controlled by the `PATH_PREFIX` env var in
[`deploy.yml`](.github/workflows/deploy.yml):

| Where the site lives | Set `PATH_PREFIX` to |
| --- | --- |
| Custom domain `mistlab.ca` | `"/"` |
| Org page `mistlab.github.io` | `"/"` |
| Project page `mistlab.github.io/website/` | `"/website/"` |

All internal links use Eleventy's `url` filter, so this single value is the only
thing to change.

### Custom domain (mistlab.ca)

Add a file named `CNAME` at the repo root containing `mistlab.ca`, set
`PATH_PREFIX` to `"/"`, and configure the domain under **Settings → Pages**.

---

## Project layout

```
_data/            YAML/JSON content (site, people groups, news, acronym, …)
src/              Pages (.njk) and per-person Markdown in src/people/
_includes/        Shared layouts and partials (nav, footer, person page)
assets/           CSS, JS, images (people/, missions/)
scripts/          ORCID publication fetcher
.github/workflows Deploy + weekly publications refresh
```
