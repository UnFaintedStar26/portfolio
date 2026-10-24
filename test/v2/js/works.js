/*
  All works on the site. Every page renders from this list.
  To add a work: copy one entry, give it a new unique id, and put its images in assets/works/.
  The first image is the cover. Order here = order on the site (best work first).
  category: "branding", "poster" or "illustration".
*/
window.WORKS = [
  {
    id: "northside-coffee",
    title: "Northside Coffee Identity",
    year: 2025,
    category: "branding",
    client: "Northside Coffee (Placeholder)",
    medium: "Brand identity system",
    size: null,
    featured: true,
    images: [
      { src: "assets/works/northside-coffee-1.svg", alt: "Placeholder: branding logo" },
      { src: "assets/works/northside-coffee-2.svg", alt: "Placeholder: branding stationery" },
      { src: "assets/works/northside-coffee-3.svg", alt: "Placeholder: branding packaging" },
      { src: "assets/works/northside-coffee-4.svg", alt: "Placeholder: branding signage" }
    ],
    summary: "A full identity for a neighborhood roaster opening its second café. Bold type, a simple mark and one strong accent color carry from cups to storefront.",
    deliverables: ["Logo and wordmark", "Color and type system", "Cup and bag packaging", "Storefront signage", "Brand guidelines"],
    brief: "Northside wanted to look like a serious roaster without losing the warmth of a corner café. The old logo did not work at small sizes.",
    approach: "I built a compact mark from the shape of a coffee bean and a rounded grotesk wordmark, then tested both on cups, bags and the shop window.",
    outcome: "The new identity launched with the second location. The packaging system now covers six blends with one template."
  },
  {
    id: "night-shift",
    title: "Night Shift",
    year: 2026,
    category: "poster",
    client: null,
    medium: "Screen print",
    size: "18 × 24 in",
    featured: true,
    images: [
      { src: "assets/works/night-shift-1.svg", alt: "Placeholder: poster cover" },
      { src: "assets/works/night-shift-2.svg", alt: "Placeholder: poster detail" }
    ],
    summary: "A two-color screen print about the city after midnight. Printed in an edition of 40.",
    deliverables: [],
    brief: "A self-initiated print for a group show on night work.",
    approach: "Hand-cut stencils, a coarse halftone and a single red pass for the focal point.",
    outcome: "Shown at the group exhibition; the edition sold out in two weeks."
  },
  {
    id: "tide-lines",
    title: "Tide Lines",
    year: 2026,
    category: "illustration",
    client: "Harbor Weekly (Placeholder)",
    medium: "Ink",
    size: "8 × 10 in",
    featured: true,
    images: [
      { src: "assets/works/tide-lines-1.svg", alt: "Placeholder: illustration editorial" }
    ],
    summary: "An editorial illustration for a long read about a fishing town and its changing coastline.",
    deliverables: [],
    brief: "Harbor Weekly needed a lead image that felt calm but carried the tension of the story.",
    approach: "Stippled ink drawing with dense line work for the water and open paper for the sky.",
    outcome: "Ran as the cover image of the weekend edition and online feature."
  },
  {
    id: "ferro-cycles",
    title: "Ferro Cycles Identity",
    year: 2024,
    category: "branding",
    client: "Ferro Cycles (Placeholder)",
    medium: "Brand identity system",
    size: null,
    featured: true,
    images: [
      { src: "assets/works/ferro-cycles-1.svg", alt: "Placeholder: branding logo" },
      { src: "assets/works/ferro-cycles-2.svg", alt: "Placeholder: branding packaging" },
      { src: "assets/works/ferro-cycles-3.svg", alt: "Placeholder: branding stationery" }
    ],
    summary: "Identity for a small workshop that builds steel bicycle frames by hand.",
    deliverables: ["Logo and frame badge", "Type system", "Packaging", "Stationery"],
    brief: "Ferro needed a mark that could be etched onto a head badge and still read on a website.",
    approach: "A monoline mark drawn from frame geometry, paired with a condensed type system for spec sheets.",
    outcome: "The badge is now on every frame that leaves the workshop, and the spec sheets doubled as the first catalog."
  },
  {
    id: "signal-noise",
    title: "Signal / Noise",
    year: 2025,
    category: "poster",
    client: "Static Club (Placeholder)",
    medium: "Risograph",
    size: "11 × 17 in",
    featured: false,
    images: [
      { src: "assets/works/signal-noise-1.svg", alt: "Placeholder: poster cover" }
    ],
    summary: "Gig poster for an electronic music night, printed on a two-drum Risograph.",
    deliverables: [],
    brief: "A poster that stands out on a crowded bulletin board from across the street.",
    approach: "Large stacked type, a grid of dots that breaks up into noise, and a single accent color.",
    outcome: "Used for the full spring season with only the dates changed."
  },
  {
    id: "halden-architects",
    title: "Halden Architects Rebrand",
    year: 2023,
    category: "branding",
    client: "Halden Architects (Placeholder)",
    medium: "Brand identity system",
    size: null,
    featured: false,
    images: [
      { src: "assets/works/halden-architects-1.svg", alt: "Placeholder: branding logo" },
      { src: "assets/works/halden-architects-2.svg", alt: "Placeholder: branding stationery" },
      { src: "assets/works/halden-architects-3.svg", alt: "Placeholder: branding signage" },
      { src: "assets/works/halden-architects-4.svg", alt: "Placeholder: branding website" }
    ],
    summary: "A quieter, more precise identity for a mid-size architecture practice.",
    deliverables: ["Logo", "Stationery", "Office signage", "Website art direction"],
    brief: "Halden's old brand looked like a law firm. They wanted something that felt like their buildings: plain materials, exact details.",
    approach: "A wordmark set on a strict grid, hairline rules taken from their drawings, and a black-and-white photo style.",
    outcome: "Rolled out across the office, proposals and the new website within one quarter."
  },
  {
    id: "open-studios",
    title: "Open Studios 2024",
    year: 2024,
    category: "poster",
    client: "Eastside Arts Council (Placeholder)",
    medium: "Digital",
    size: "24 × 36 in",
    featured: false,
    images: [
      { src: "assets/works/open-studios-1.svg", alt: "Placeholder: poster cover" },
      { src: "assets/works/open-studios-2.svg", alt: "Placeholder: poster street" }
    ],
    summary: "Campaign poster for a weekend of open artist studios across one neighborhood.",
    deliverables: [],
    brief: "One poster that also had to work as a map and a social media tile.",
    approach: "A modular grid where each studio is a square, so the layout could be cropped for every format.",
    outcome: "Printed for bus shelters and adapted into 12 social posts."
  },
  {
    id: "small-machines",
    title: "Small Machines",
    year: 2025,
    category: "illustration",
    client: "Gearhead Supply (Placeholder)",
    medium: "Digital",
    size: null,
    featured: false,
    images: [
      { src: "assets/works/small-machines-1.svg", alt: "Placeholder: illustration artwork" },
      { src: "assets/works/small-machines-2.svg", alt: "Placeholder: illustration merch" }
    ],
    summary: "A set of small robot characters drawn for a T-shirt and sticker range.",
    deliverables: [],
    brief: "Merch designs that print well in one or two colors on dark fabric.",
    approach: "Simple geometric bodies, thick outlines and halftone shading that survives screen printing.",
    outcome: "Launched as four shirts and a sticker pack in the client's online shop."
  },
  {
    id: "lumen-festival",
    title: "Lumen Light Festival",
    year: 2022,
    category: "branding",
    client: "Lumen Festival (Placeholder)",
    medium: "Event identity",
    size: null,
    featured: false,
    images: [
      { src: "assets/works/lumen-festival-1.svg", alt: "Placeholder: branding logo" },
      { src: "assets/works/lumen-festival-2.svg", alt: "Placeholder: branding signage" },
      { src: "assets/works/lumen-festival-3.svg", alt: "Placeholder: branding merch" }
    ],
    summary: "Identity and wayfinding for a three-night outdoor light art festival.",
    deliverables: ["Festival logo", "Wayfinding signage", "Merch", "Social templates"],
    brief: "Visitors had to find 20 installations in the dark across a large park.",
    approach: "High-contrast signs with one bold arrow system and a logo built from a crosshair.",
    outcome: "Attendance grew on the previous year, and the sign system is being reused for the next edition."
  },
  {
    id: "after-hours",
    title: "After Hours Jazz Series",
    year: 2023,
    category: "poster",
    client: "Blue Room Club (Placeholder)",
    medium: "Screen print",
    size: "18 × 24 in",
    featured: false,
    images: [
      { src: "assets/works/after-hours-1.svg", alt: "Placeholder: poster cover" }
    ],
    summary: "Poster for a monthly late-night jazz series in a small basement club.",
    deliverables: [],
    brief: "A recurring poster that changes each month but is always recognizable.",
    approach: "A fixed type block and a rotating geometric shape, printed in black and white with one red accent.",
    outcome: "Ran for twelve months; the club now sells the posters at the bar."
  },
  {
    id: "field-notes",
    title: "Field Notes",
    year: 2024,
    category: "illustration",
    client: null,
    medium: "Ink",
    size: "8 × 10 in",
    featured: false,
    images: [
      { src: "assets/works/field-notes-1.svg", alt: "Placeholder: illustration sketchbook" }
    ],
    summary: "Personal series of ink studies of plants and tools, drawn on walks.",
    deliverables: [],
    brief: "A personal project to practice line and texture away from client work.",
    approach: "One drawing a day for a month, stippled ink only, no digital clean-up.",
    outcome: "Became a small zine and a set of prints."
  },
  {
    id: "paper-moon",
    title: "Paper Moon",
    year: 2022,
    category: "illustration",
    client: "Moonrise Books (Placeholder)",
    medium: "Digital",
    size: null,
    featured: false,
    images: [
      { src: "assets/works/paper-moon-1.svg", alt: "Placeholder: illustration cover" },
      { src: "assets/works/paper-moon-2.svg", alt: "Placeholder: illustration spread" }
    ],
    summary: "Cover and chapter illustrations for a short-story collection.",
    deliverables: [],
    brief: "A cover that works in black and white for the paperback and in color for the e-book.",
    approach: "Strong silhouettes and a grid of halftone dots, with red used only for the moon.",
    outcome: "Published as the paperback cover and six chapter openers."
  },
];
