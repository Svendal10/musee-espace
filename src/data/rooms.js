export const ROOMS = [
  {
    id: 'apollo',
    name: 'Programme Apollo',
    tagline: 'Les premiers pas de l’humanité sur la Lune',
    description:
      "De 1968 à 1972, le programme Apollo a marqué l'histoire spatiale. Des missions audacieuses, des images inoubliables et des sons qui résonnent encore.",
    image: 'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~medium.jpg',
    queries: [
      { q: 'Apollo 11', media_type: 'image', year_start: '1969', year_end: '1969' },
      { q: 'Apollo mission', media_type: 'image' },
    ],
  },
  {
    id: 'hubble',
    name: 'Télescope Hubble',
    tagline: 'Notre œil sur l’univers profond',
    description:
      "Depuis 1990, Hubble observe les confins de l'univers et nous offre des images d'une beauté vertigineuse : nébuleuses, galaxies, naissances d'étoiles.",
    image: 'https://images-assets.nasa.gov/image/hubble-30th-anniversary-graphic/hubble-30th-anniversary-graphic~medium.jpg',
    queries: [
      { q: 'Hubble', media_type: 'image' },
      { q: 'Hubble galaxy', media_type: 'image' },
    ],
  },
  {
    id: 'iss',
    name: 'Station spatiale internationale',
    tagline: 'Un laboratoire en orbite',
    description:
      "La Station spatiale internationale (ISS) est habitée sans interruption depuis 2000. Un avant-poste de l'humanité à 400 km au-dessus de nos têtes.",
    image: 'https://images-assets.nasa.gov/image/iss065e039797/iss065e039797~medium.jpg',
    queries: [
      { q: 'International Space Station', media_type: 'image' },
      { q: 'ISS expedition', media_type: 'image' },
    ],
  },
  {
    id: 'mars',
    name: 'Exploration de Mars',
    tagline: 'La planète rouge sous toutes ses facettes',
    description:
      "Rovers, orbiteurs, atterrisseurs… Mars est l'un des astres les plus étudiés. Découvrez ses paysages, ses mystères et les instruments qui l'explorent.",
    image: 'https://images-assets.nasa.gov/image/PIA25463/PIA25463~medium.jpg',
    queries: [
      { q: 'Mars rover', media_type: 'image' },
      { q: 'Mars surface', media_type: 'image' },
    ],
  },
  {
    id: 'artemis',
    name: 'Programme Artemis',
    tagline: 'Le retour de l’humanité sur la Lune',
    description:
      "Artemis prépare le retour de l'humanité sur la Lune, et au-delà, vers Mars. De nouvelles générations de fusées, de vaisseaux et d'équipages se préparent.",
    image: 'https://images-assets.nasa.gov/image/KSC-20221116-PH-KLS01_0030/KSC-20221116-PH-KLS01_0030~medium.jpg',
    queries: [
      { q: 'Artemis', media_type: 'image' },
      { q: 'Orion spacecraft', media_type: 'image' },
    ],
  },
];

export function getRoomById(id) {
  return ROOMS.find((r) => r.id === id);
}