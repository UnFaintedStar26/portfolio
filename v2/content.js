/*
  YOUR SITE TEXT
  ==============
  Edit the words between the quotes, save this file, then refresh the page in your browser.

  Rules that keep the page working:
  - Keep the quotes around every piece of text, and the comma at the end of each line.
  - To use a quote mark inside your text, use a curly one (’ or ”) instead of a straight one.
  - To hide a line you don't want, leave its quotes empty, like this: ""

  Your projects are not in this file. They live in js/works.js.

  STILL TO FILL (owner): name, email and the social links below are placeholders.
*/
window.SITE = {
  // The site's name, shown large at the top left of every page.
  brand: "Portfolio",

  // Your name. Used in the browser tab, the credits and the copyright line.
  name: "Melvin Minchala",

  // Shown in the browser tab after your name.
  pageTitle: "Graphic design portfolio",

  // The short summary search engines and link previews show.
  description: "Campaigns, poster series, book covers and editorial layouts by Your Name.",

  // The pitch bar just under the banner: one headline and one short paragraph. Rewrite freely.
  pitch: {
    headline: "Every project is a world to build.",
    support: "I’m a graphic designer who builds visual worlds: a cybersecurity campaign that makes staying safe online feel urgent, sci-fi posters for films I love, book covers and an image journal. Bold type, one loud red, and a clear story in every piece.",
  },

  // Your email address. Every “email me” link on the page uses it.
  email: "melvinexpress@gmail.com",

  // The big picture on the first screen.
  hero: {
    // Your banner picture, 1920 × 1080 pixels. If the file is missing, a labelled placeholder shows instead.
    image: "assets/hero/hero-banner.jpg",
    // Describe the picture in a sentence, for people who can't see it.
    alt: "A red city skyline under a black night sky with white and gray clouds",
    // Which part of the photo stays in view when phones crop it, as "left-right top-bottom".
    // "50% 50%" keeps the middle; "50% 100%" keeps the bottom (here, the skyline) when the top is cropped.
    focus: "50% 100%",
  },

  // The links at the top of the page.
  nav: {
    work: "Work",
    spotlight: "Spotlight",
    contact: "Contact",
  },

  // The list of all your projects.
  work: {
    title: "Selected work",
    // Leave empty to show a count of your projects automatically.
    intro: "",
  },

  // One project shown large on the home page: the id of a project from js/works.js,
  // and which of its images to show (0 is the first image, 1 the second, and so on).
  spotlight: {
    workId: "sci-fi-movie-posters",
    image: 0,
    linkLabel: "Open the project",
  },

  // Shown when a project link points at a project that isn't in js/works.js (yet).
  workInProgress: {
    heading: "Work in Progress",
    line: "This project is still being put together. Check back soon.",
  },

  // The last section of the page.
  contact: {
    headline: "Let’s work together.",
    bio: "Have a campaign, poster series or publication in mind? Send a short note.",
    // Leave "" to hide it; add your usual turnaround times here if you want them shown.
    turnaround: "",
    elsewhereLabel: "Elsewhere",
    backToTop: "Back to the top",
  },

  // Your social links. Copy a line to add one, delete a line to remove one.
  // Replace "#" with the full address, for example "https://instagram.com/yourname".
  social: [
    { label: "Instagram @yourname", url: "#" },
    { label: "Behance @yourname", url: "#" },
    { label: "LinkedIn @yourname", url: "#" },
  ],
};
