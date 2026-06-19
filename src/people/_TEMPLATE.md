---
# ============================================================================
# HOW TO ADD A LAB MEMBER
# ============================================================================
# 1. Copy this file to firstname-lastname.md (lowercase, dashes).
#    The filename becomes the page URL: /people/firstname-lastname/
# 2. Fill in the fields below. Delete any optional field you don't need.
# 3. Drop a square photo in assets/images/people/ and point `photo:` at it.
#    No photo? Delete the `photo:` line and the page shows the person's initials.
# 4. Write the bio in Markdown below the second `---`.
#
# This file itself is never published (permalink:false + excluded from the
# people collection), so it won't appear on the site.
# ============================================================================

permalink: false
eleventyExcludeFromCollections: true

name: Firstname Lastname
role: phd                         # faculty | research_associate | postdoc | phd | msc | intern
title: PhD Student                # free-text label shown under the name
photo: firstname-lastname.jpg     # file in assets/images/people/ (optional)
short_bio: One sentence shown on the People listing and the homepage card.
supervisor: Giovanni Beltrame     # optional
tags: [Topic One, Topic Two]      # optional research-area chips
order: 99                         # optional sort order within the role group (lower = first)

# --- Optional links (delete the ones you don't use) ---
email: firstname.lastname@polymtl.ca
website: https://example.com
scholar: GOOGLE_SCHOLAR_ID        # the user= value from a Scholar profile URL
github: githubusername            # username only, not the full URL
linkedin: https://www.linkedin.com/in/username/
orcid: 0000-0000-0000-0000        # faculty only — feeds the auto publications fetch
---

Write the full bio here in **Markdown**. You can use headings, lists, and links.

## Current Work

Describe current projects.

## Contact

Reach this person at [email](mailto:firstname.lastname@polymtl.ca).
