// Only things that are verifiably true live here.
//
//   voice : path to a short voice memo of YOU talking about the drawing (see /public/artworks/voice/)
//   words : optional, a line or two in your own words (shown under the player / on the card)
//
// Leave voice as null and words as '' until you've got the real thing. Nothing gets invented for you.
export const ARTWORKS_DATA = [
  {
    id: 'ronaldo-goat',
    likeSeed: 34, // starting hearts, not real visitors. set to 0 for a pure count
    title: 'CR7',
    category: 'Sports',
    categorySlug: 'sports',
    size: 'A4',
    image: '/artworks/ronaldo-goat.webp',
    voice: null, // e.g. '/artworks/voice/cr7.m4a'
    words: '',
  },
  {
    id: 'paul-walker',
    likeSeed: 47, // starting hearts, not real visitors. set to 0 for a pure count
    title: 'Paul Walker',
    category: 'Portraits',
    categorySlug: 'portrait',
    size: 'A4',
    image: '/artworks/paul-walker-portrait.webp',
    voice: null,
    words: '',
  },
  {
    id: 'radha-krishna-eyes',
    likeSeed: 52, // starting hearts, not real visitors. set to 0 for a pure count
    title: 'Radha Krishna',
    category: 'Fine Art',
    categorySlug: 'spiritual',
    size: 'A3',
    image: '/artworks/radha-krishna-eyes.webp',
    voice: null,
    words: '',
  },
  {
    id: 'ronaldo-portrait',
    likeSeed: 28, // starting hearts, not real visitors. set to 0 for a pure count
    title: 'Ronaldo',
    category: 'Portraits',
    categorySlug: 'portrait',
    size: 'A3',
    image: '/artworks/ronaldo-smiling-portrait.webp',
    voice: null,
    words: '',
  },
  {
    id: 'falling-in-eyes',
    likeSeed: 19, // starting hearts, not real visitors. set to 0 for a pure count
    title: 'Falling',
    category: 'Fine Art',
    categorySlug: 'spiritual',
    size: 'A4',
    image: '/artworks/falling-in-eyes.webp',
    voice: null,
    words: '',
  },
];