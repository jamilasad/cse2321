# CSE-2321 · Data Structures — Course Site

Interactive lesson pages for **CSE-2321 (Data Structures)** and **CSE-2322 (Data Structures Lab)**
Dept. of CSE, International Islamic University Chittagong

**Live site:** https://jamilasad.github.io/cse2321/

---

## What this is

One self-contained HTML page per class. Every page runs offline from a
classroom projector — no build step, no server, no npm. Images are embedded
directly in the files.

Each lesson has two tabs: **Lesson** and **Exam & Interview**.

## Layout

```
index.html                 Front page — the semester spine
2321-theory/<segment>/     Theory classes, one file per class
2322-lab/<segment>/        Lab sessions and problem sheets
tools/                     Standalone simulators
exam-prep/                 Past papers, model answers, revision
```

The ten segment folders match the ten segments on the front page, in order.

## Adding a class

1. Save the HTML into the right segment folder.
2. Open `index.html`, find that segment in the `SEGMENTS` array, and add one
   line to its `theory[]` or `lab[]` list.
3. Update the drawer list and the prev/next links on the sibling pages.

Then publish:

```bash
git add -A
git commit -m "Add <class name>"
git push
```

The live site updates in about a minute.

## Previewing locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## A note on offline use

The lesson pages written for this course work fully offline. Five older pages
(`avl-trees`, `hashing-journey`, `binary-search-1`, `binary-search-2`,
`hash-simulator`) load Tailwind and other libraries from a CDN, so those need
an internet connection.

---

Jamil As-ad · Lecturer, Dept. of CSE · IIUC
