export const ARTWORKS_DATA = [
  {
    id: 'ronaldo-goat',
    title: 'CR7',
    subtitle: 'Torso & light study',
    artist: 'Gagan Poojari',
    year: '2023',
    category: 'Sports',
    categorySlug: 'sports',
    medium: 'Compressed charcoal & graphite on Bristol smooth',
    dimensions: 'A3',
    timeSpent: '28 hours over 2 weeks',
    image: '/artworks/ronaldo-goat.webp',
    // wip: '/artworks/ronaldo-goat-wip.webp', // optional: unlocks the Process slider in the viewer
    caption: 'the background was the hard part.',
    story:
      "Ronaldo's celebration pose, all that raw energy. The muscles weren't the hard part. Getting the background properly black was, so he looks like he's stepping out of nothing. My fingers stayed black for days.",
    pencils: 'Staedtler 6B–8B, Cretacolor charcoal powder, Mono Zero eraser',
    funFact: 'Blended the skin with an old makeup sponge so no finger oil got on the paper.',
  },
  {
    id: 'paul-walker',
    title: 'Paul Walker',
    subtitle: "Brian O'Conner",
    artist: 'Gagan Poojari',
    year: '2024',
    category: 'Portraits',
    categorySlug: 'portrait',
    medium: '0.3mm mechanical pencil & soft charcoal',
    dimensions: 'A3',
    timeSpent: '34 hours',
    image: '/artworks/paul-walker-portrait.webp',
    caption: 'one pupil reflection ate a whole evening.',
    story:
      "I grew up on Fast & Furious and Paul Walker was my hero as a kid, so this one got emotional. Get the gap between the eyelids wrong by half a millimetre and the likeness is gone.",
    pencils: 'Pentel 0.3mm 2B, Staedtler Mars Lumograph, paper stumps',
    funFact: 'The pupil reflections took one full evening, with "See You Again" on loop.',
  },
  {
    id: 'radha-krishna-eyes',
    title: 'Radha Krishna',
    subtitle: 'Two pairs of eyes',
    artist: 'Gagan Poojari',
    year: '2026',
    category: 'Fine Art',
    categorySlug: 'spiritual',
    medium: 'Charcoal, graphite & white gel ink',
    dimensions: 'A3',
    timeSpent: '30 hours',
    image: '/artworks/radha-krishna-eyes.webp',
    caption: 'masking tape for that clean split.',
    story:
      "I didn't want a standard portrait, just the emotion in the eyes. The horizontal split makes the two faces talk to each other. The white florals and the tilak are gel ink on top of dried charcoal.",
    pencils: 'Staedtler 4B–10B, Sakura Gelly Roll 08 white, masking tape',
    funFact: 'Low-tack tape down the middle gave me that razor-sharp split.',
  },
  {
    id: 'ronaldo-portrait',
    title: 'Ronaldo',
    subtitle: 'Close-up portrait',
    artist: 'Gagan Poojari',
    year: '2025',
    category: 'Portraits',
    categorySlug: 'portrait',
    medium: 'Graphite (2B–10B) on 300gsm paper',
    dimensions: 'A3',
    timeSpent: '25 hours',
    image: '/artworks/ronaldo-smiling-portrait.webp',
    caption: 'curls. so many curls.',
    story:
      "Close-ups are brutal because everyone can tell when skin looks wrong. Doing the curls was meditative and exhausting at the same time.",
    pencils: 'Staedtler Mars Lumograph 2B–10B, kneaded eraser',
    funFact: 'Dabbed the pores out with a kneaded eraser rolled to a needle point.',
  },
  {
    id: 'falling-in-eyes',
    title: 'Falling',
    subtitle: 'Surreal perspective experiment',
    artist: 'Gagan Poojari',
    year: '2023',
    category: 'Fine Art',
    categorySlug: 'spiritual',
    medium: 'Charcoal ink & graphite on heavyweight paper',
    dimensions: 'A3',
    timeSpent: '26 hours',
    image: '/artworks/falling-in-eyes.webp',
    caption: 'T-square before any charcoal. late night idea.',
    story:
      "Late one night I wanted something weirder than another portrait: a person tumbling down into a pair of eyes. Mixing ruler-straight lines with soft anatomy was a lot of fun.",
    pencils: 'Charcoal pencil, ruler, Staedtler HB & 6B',
    funFact: 'Drew the grid with a T-square before the charcoal touched the paper.',
  },
];

export const hoursOf = (art) => parseInt(art.timeSpent, 10) || 0;
export const TOTAL_HOURS = ARTWORKS_DATA.reduce((sum, a) => sum + hoursOf(a), 0);
export const LONGEST_HOURS = Math.max(...ARTWORKS_DATA.map(hoursOf));
const years = ARTWORKS_DATA.map((a) => Number(a.year));
export const YEAR_SPAN = `${Math.min(...years)}–${Math.max(...years)}`;