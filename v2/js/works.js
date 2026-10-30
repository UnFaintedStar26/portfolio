/*
  All projects on the site. Every page reads from this list; the order here is the order on the site.
  Each project's first image is its cover. Images live in assets/works/<project>/.

  TO FILL (owner): every "Description coming soon." line, and each null year / client / role.
  Write a year as a number (2025), the others in quotes. A null shows on the page as "To be added".

  ROWS (optional): how the project page lays the images out, top to bottom. Each number is how many images
  sit side by side in that row, taken in the order of "images". [1, 3] means: the first image alone, then the
  next three in one row. Images left over show one per row. Phones always show one image per row.
*/
window.CATEGORIES = {
  campaign: "Campaign",
  "poster-series": "Poster series",
  "book-covers": "Book covers",
  editorial: "Editorial layout",
};

window.WORKS = [
  {
    id: "cybershield",
    title: "CyberShield Campaign",
    category: "campaign",
    year: 2023,
    started: "November 10, 2023",
    client: null,
    role: "Project lead",
    summary: "A cybersecurity awareness campaign that teaches young adults (17–24) the digital skills to stay safe online.",
    brief: "CYBERSHIELD aims to educate and protect young adults online, by providing young adults with essential digital skills, to raise awareness about cyber threats. Our primary focus is teenagers and young adults (17-24), this group often spend most of their time online, and are uncultured on the risks of cyber attacks. This makes them vulnerable to attacks and we want to prevent this by putting all our effort to educating them about this topic.",
    approach: "As project lead I took the campaign from a wireframe of the website and a style guide to the logo, then the posters and mockups. The logo began as pencil sketches of shields, circuit lines and brains, refined into a circuit-board shield with a CS chip at its center.",
    deliverables: ["Website wireframe", "Style guide", "Logo", "Poster", "Instagram posts", "Campaign and poster mockups", "Campaign website"],
    // Shown on the project page as a small style guide. Colors are hex codes.
    styleGuide: {
      fonts: [["Headers and subheadings", "Chakra Petch Bold"], ["Paragraph text", "Nunito Sans"]],
      colors: ["#003366", "#FFD700", "#A9A9A9", "#000000", "#FFFFFF"],
    },
    rows: [1, 2, 1, 1, 3, 3, 3, 1, 2, 2, 1],
    images: [
      { src: "assets/works/cybershield/01-logo.webp", alt: "CyberShield logo: a shield with a circuit-board pattern around a CS chip" },
      { src: "assets/works/cybershield/01a-sketch-1.jpg", alt: "Pencil sketches exploring CyberShield logo ideas: shields, circuit lines and brains, each with the tagline Where Knowledge Is Power" },
      { src: "assets/works/cybershield/01b-sketch-2.jpg", alt: "Pencil sketches of CyberShield logo lockups: a brain mark, a thin wordmark and a shield in a circle" },
      { src: "assets/works/cybershield/01c-design-phase.jpg", alt: "Logo design phase: the circuit-board shield in white, yellow and navy versions, the last with the CS chip" },
      { src: "assets/works/cybershield/02-poster.jpg", alt: "CyberShield campaign poster" },
      { src: "assets/works/cybershield/10-instagram-1.jpg", alt: "CyberShield Instagram post 1" },
      { src: "assets/works/cybershield/11-instagram-2.jpg", alt: "CyberShield Instagram post 2" },
      { src: "assets/works/cybershield/12-instagram-3.jpg", alt: "CyberShield Instagram post 3" },
      { src: "assets/works/cybershield/03-campaign-mockup-1.jpg", alt: "CyberShield campaign mockup 1, on a phone" },
      { src: "assets/works/cybershield/04-campaign-mockup-2.jpg", alt: "CyberShield campaign mockup 2, on a phone" },
      { src: "assets/works/cybershield/05-campaign-mockup-3.jpg", alt: "CyberShield campaign mockup 3, on a phone" },
      { src: "assets/works/cybershield/06-poster-mockup-1.jpg", alt: "CyberShield poster mockup 1" },
      { src: "assets/works/cybershield/07-poster-mockup-2.jpg", alt: "CyberShield poster mockup 2" },
      { src: "assets/works/cybershield/08-poster-mockup-3.jpg", alt: "CyberShield poster mockup 3" },
      { src: "assets/works/cybershield/09-laptop-mockup.jpg", alt: "The CyberShield website shown on a laptop" },
      { src: "assets/works/cybershield/13-website-home.jpg", alt: "CyberShield website: main front page" },
      { src: "assets/works/cybershield/14-website-about.jpg", alt: "CyberShield website: About Us page" },
      { src: "assets/works/cybershield/16-website-testimonies.jpg", alt: "CyberShield website: testimonies page" },
      { src: "assets/works/cybershield/17-website-testimony.jpg", alt: "CyberShield website: a single testimony" },
      { src: "assets/works/cybershield/15-website-resources.jpg", alt: "CyberShield website: resource page, full length" },
    ],
  },
  {
    id: "sci-fi-movie-posters",
    title: "Sci-fi Movie Posters",
    category: "poster-series",
    year: 2026,
    started: "April 12, 2026",
    dateLabel: "Made",
    client: null,
    role: "Graphic designer",
    summary: "A series of three movie posters for Ridley Scott sci-fi films: Blade Runner (1982), The Martian (2015) and Alien (1979).",
    brief: "All three posters share one visual system: a black background, a red/salmon halftone portrait at the top, a red line-art scene at the bottom, a thin white frame and white geometric sans-serif titles. Blade Runner and The Martian came first; Alien completes the set of three.",
    approach: "I started by finding high-quality images, then used Photoshop to remove backgrounds, blend the images together and add effects. Finally I used Illustrator for the vector elements, such as the border and the text.",
    deliverables: ["Alien poster", "Blade Runner poster", "The Martian poster", "Mockups"],
    styleGuide: {
      colors: ["#EE4342", "#FFFFFF", "#000000"],
    },
    rows: [3],
    images: [
      { src: "assets/works/movie-posters/01-alien.jpg", alt: "Alien movie poster" },
      { src: "assets/works/movie-posters/02-blade-runner.jpg", alt: "Blade Runner movie poster" },
      { src: "assets/works/movie-posters/03-martian.jpg", alt: "Martian (Space) movie poster" },
      { src: "assets/works/movie-posters/04-mockup-1.jpg", alt: "Sci-fi movie poster mockup 1" },
      { src: "assets/works/movie-posters/05-mockup-2.jpg", alt: "Sci-fi movie poster mockup 2" },
      { src: "assets/works/movie-posters/06-mockup-3.jpg", alt: "Sci-fi movie poster mockup 3" },
      { src: "assets/works/movie-posters/07-mockup-4.jpg", alt: "Sci-fi movie poster mockup 4" },
      { src: "assets/works/movie-posters/08-mockup-5.jpg", alt: "Sci-fi movie poster mockup 5" },
    ],
  },
  {
    id: "book-cover-concepts",
    title: "Book Cover Concepts",
    category: "book-covers",
    year: null,
    client: null,
    role: null,
    summary: "Description coming soon.",
    deliverables: ["Three cover and spine designs", "A second version"],
    images: [
      { src: "assets/works/book-covers/01-design-1.jpg", alt: "Book cover and spine, design 1" },
      { src: "assets/works/book-covers/02-design-2.jpg", alt: "Book cover and spine, design 2" },
      { src: "assets/works/book-covers/03-design-3.jpg", alt: "Book cover and spine, design 3" },
      { src: "assets/works/book-covers/04-version-2.jpg", alt: "Book cover and spine, version 2" },
    ],
  },
  {
    id: "image-journal-booklet",
    title: "Image Journal Booklet",
    category: "editorial",
    year: null,
    client: null,
    role: null,
    summary: "Description coming soon.",
    deliverables: ["Front and back cover", "Pages 2 to 17"],
    images: [
      { src: "assets/works/image-journal/01-cover-front.jpg", alt: "Image Journal booklet, front cover" },
      { src: "assets/works/image-journal/02-cover-back.jpg", alt: "Image Journal booklet, back cover" },
      { src: "assets/works/image-journal/03-page-2.jpg", alt: "Image Journal booklet, page 2" },
      { src: "assets/works/image-journal/04-page-3.jpg", alt: "Image Journal booklet, page 3" },
      { src: "assets/works/image-journal/05-page-4.jpg", alt: "Image Journal booklet, page 4" },
      { src: "assets/works/image-journal/06-page-5.jpg", alt: "Image Journal booklet, page 5" },
      { src: "assets/works/image-journal/07-page-6.jpg", alt: "Image Journal booklet, page 6" },
      { src: "assets/works/image-journal/08-page-7.jpg", alt: "Image Journal booklet, page 7" },
      { src: "assets/works/image-journal/09-page-8.jpg", alt: "Image Journal booklet, page 8" },
      { src: "assets/works/image-journal/10-page-9.jpg", alt: "Image Journal booklet, page 9" },
      { src: "assets/works/image-journal/11-page-10.jpg", alt: "Image Journal booklet, page 10" },
      { src: "assets/works/image-journal/12-page-11.jpg", alt: "Image Journal booklet, page 11" },
      { src: "assets/works/image-journal/13-page-12.jpg", alt: "Image Journal booklet, page 12" },
      { src: "assets/works/image-journal/14-page-13.jpg", alt: "Image Journal booklet, page 13" },
      { src: "assets/works/image-journal/15-page-14.jpg", alt: "Image Journal booklet, page 14" },
      { src: "assets/works/image-journal/16-page-15.jpg", alt: "Image Journal booklet, page 15" },
      { src: "assets/works/image-journal/17-page-16.jpg", alt: "Image Journal booklet, page 16" },
      { src: "assets/works/image-journal/18-page-17.jpg", alt: "Image Journal booklet, page 17" },
    ],
  },
];
