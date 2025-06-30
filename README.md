# MIST Lab Website Source

This repository contains the source files for the MIST Lab website built with [Nikola](https://getnikola.com/). The `master` branch is automatically generated from the contents of the `src` branch. Thus, when editing the website, you must only edit the `src` branch.

## Editing Your Personal Page

All personal pages are stored under the `people/` directory. To create or update your page:

1. `git clone -b src https://github.com/MISTLab/mistlab.github.io.git`
2. Create a new folder under `people/` named after your name (Try to follow the same name partern).
3. Add an `index.md` file with your biography and other content in Markdown format.
4. Create a `person.ini` file to describe yourself:
   ```ini
   [Person]
   Name = Your Name
   Occupation = Your Title (E.g. Master Student)
   Tagline = Short description
   Image = /people/<your_folder>/<your_photo>
   ```
   You can also add social links such as `Twitter`, `Linkedin`, etc.
5. Create a new folder under `files/people/` with the same name as the one under `people/`.
6. Place your landscape (ratio of arround 1.6) picture and use the name from `Image` field of your `person.ini`.
7. Commit your change.
