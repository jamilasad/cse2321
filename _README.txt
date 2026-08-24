COURSE SITE — CSE-2321 (Data Structures) & CSE-2322 (Data Structures Lab)
Dept. of CSE, International Islamic University Chittagong

WHERE THINGS GO
---------------
index.html                  The front page. Edit the SEGMENTS array inside it to add content.
2321-theory/<segment>/      Theory classes, one HTML file per class.
2322-lab/<segment>/         Lab sessions and problem sheets.
tools/                      Standalone simulators and toys (not tied to one class).
exam-prep/                  Past papers, model answers, revision sheets.

The ten segment folders match the ten segments on the front page, in order.

TO ADD A NEW CLASS
------------------
1. Save the HTML file into the right segment folder, e.g.
      2321-theory/02-arrays-and-strings/01-linear-arrays.html
2. Open index.html, find that segment in the SEGMENTS array, and add one line
   to its  theory[]  or  lab[]  list:

      { t:'Linear arrays in memory',
        d:'Base address · index calculation · insert and delete cost',
        h:'2321-theory/02-arrays-and-strings/01-linear-arrays.html',
        k:'lesson' }

   Leave  h:''  and the row shows greyed out and unclickable.

NAMING
------
Use lowercase, hyphens, no spaces. Spaces break links on web hosting.

SHARING WITH STUDENTS
---------------------
Share this whole 'course-site' folder and nothing above it.
Every page works offline with no internet, apart from web fonts.
