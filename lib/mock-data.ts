import type { Product, Category, ScentStoryData } from '@/types';

const LOCAL_IMAGES = [
  '/images/hero_final.jpg',
  '/images/category_mens_fragrance_1778780026029.png',
  '/images/category_womens_fragrance_retry_1778781640503.png',
  '/images/category_unisex_fragrance_1778781036963.png',
  '/images/category_oud_oriental_fragrance_1778781746608.png',
];

const img = (id: string, w = 1200, h = 1500) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % LOCAL_IMAGES.length;
  return LOCAL_IMAGES[index];
};

const heroLifestyle = LOCAL_IMAGES[0];
const woman = LOCAL_IMAGES[2];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    handle: 'muted-forest',
    title: 'Muted Forest',
    description:
      'A serene composition layering crisp vetiver and cedarwood against a heart of ancient mossy notes. Inspired by quiet northern woodlands at dawn — pure, undiluted Grade A fragrance oil.',
    price: 28,
    currencyCode: 'USD',
    images: [
      { url: '/images/scent_muted_forest.png', altText: 'Muted Forest fragrance bottle', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Muted Forest editorial', width: 1200, height: 1500 },
      { url: img('1615634260167-c8cdede054de'), altText: 'Muted Forest lifestyle', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Muted Forest detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v1-05', title: '0.5oz Sample', price: 12, availableForSale: true, selectedOptions: [{ name: 'Size', value: '0.5oz' }] },
      { id: 'v1-1', title: '1oz', price: 22, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v1-2', title: '2oz', price: 38, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
      { id: 'v1-4', title: '4oz', price: 68, availableForSale: true, selectedOptions: [{ name: 'Size', value: '4oz' }] },
      { id: 'v1-8', title: '8oz', price: 120, availableForSale: false, selectedOptions: [{ name: 'Size', value: '8oz' }] },
    ],
    scentFamily: 'Woody',
    inspiredBy: 'Tom Ford Oud Wood',
    tags: ['mens', 'unisex'],
    isNew: true,
  },
  {
    id: 'p2',
    handle: 'vanilla-ember',
    title: 'Vanilla Ember',
    description:
      'Warm and inviting — creamy bourbon vanilla wrapped around smoky sandalwood with whispers of caramelised amber. A signature gourmand that lingers long after dusk.',
    price: 32,
    currencyCode: 'USD',
    images: [
      { url: '/images/collection_bottles_amber.png', altText: 'Vanilla Ember', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Vanilla Ember close', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'Vanilla Ember lifestyle', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Vanilla Ember detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v2-05', title: '0.5oz Sample', price: 14, availableForSale: true, selectedOptions: [{ name: 'Size', value: '0.5oz' }] },
      { id: 'v2-1', title: '1oz', price: 26, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v2-2', title: '2oz', price: 42, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
      { id: 'v2-4', title: '4oz', price: 78, availableForSale: true, selectedOptions: [{ name: 'Size', value: '4oz' }] },
    ],
    scentFamily: 'Gourmand',
    inspiredBy: "Maison Margiela By the Fireplace",
    tags: ['womens', 'unisex', 'best-seller'],
  },
  {
    id: 'p3',
    handle: 'citrus-lane',
    title: 'Citrus Lane',
    description:
      'Sun-drenched bergamot and freshly zested mandarin meet sharp grapefruit over a clean cedar base. A Mediterranean morning captured in glass.',
    price: 26,
    currencyCode: 'USD',
    images: [
      { url: img('1610461888750-10bfc601b874'), altText: 'Citrus Lane bottle', width: 1200, height: 1500 },
      { url: img('1615634260167-c8cdede054de'), altText: 'Citrus Lane lifestyle', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Citrus Lane detail', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Citrus Lane close', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v3-05', title: '0.5oz Sample', price: 11, availableForSale: true, selectedOptions: [{ name: 'Size', value: '0.5oz' }] },
      { id: 'v3-1', title: '1oz', price: 20, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v3-2', title: '2oz', price: 34, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
    ],
    scentFamily: 'Citrus',
    inspiredBy: 'Acqua di Parma Colonia',
    tags: ['unisex', 'fresh'],
    isNew: true,
  },
  {
    id: 'p4',
    handle: 'rose-noir',
    title: 'Rose Noir',
    description:
      'A modern, smoky reimagining of the rose — Bulgarian damascena blooms folded into oud and ambroxan. Dark, sensual, unmistakable.',
    price: 36,
    currencyCode: 'USD',
    images: [
      { url: '/images/scent_floral_pink.png', altText: 'Rose Noir bottle', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Rose Noir close', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'Rose Noir lifestyle', width: 1200, height: 1500 },
      { url: img('1615634260167-c8cdede054de'), altText: 'Rose Noir detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v4-1', title: '1oz', price: 28, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v4-2', title: '2oz', price: 48, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
      { id: 'v4-4', title: '4oz', price: 86, availableForSale: true, selectedOptions: [{ name: 'Size', value: '4oz' }] },
    ],
    scentFamily: 'Floral',
    inspiredBy: 'Tom Ford Rose Prick',
    tags: ['womens'],
  },
  {
    id: 'p5',
    handle: 'amber-dusk',
    title: 'Amber Dusk',
    description:
      'Resinous amber, warm benzoin, and dry tonka beans melt into a soft skin-musk drydown. The fragrance equivalent of golden hour.',
    price: 30,
    currencyCode: 'USD',
    images: [
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Amber Dusk', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Amber Dusk close', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'Amber Dusk lifestyle', width: 1200, height: 1500 },
      { url: img('1615634260167-c8cdede054de'), altText: 'Amber Dusk detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v5-1', title: '1oz', price: 24, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v5-2', title: '2oz', price: 40, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
      { id: 'v5-4', title: '4oz', price: 72, availableForSale: true, selectedOptions: [{ name: 'Size', value: '4oz' }] },
    ],
    scentFamily: 'Oriental',
    inspiredBy: 'YSL Libre',
    tags: ['unisex', 'best-seller'],
  },
  {
    id: 'p6',
    handle: 'oud-velvet',
    title: 'Oud Velvet',
    description:
      'A regal, all-night-long oud anchored by smoky agarwood and softened with patchouli, leather and a faint touch of saffron.',
    price: 42,
    currencyCode: 'USD',
    images: [
      { url: img('1541643600914-78b084683601'), altText: 'Oud Velvet', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'Oud Velvet close', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Oud Velvet lifestyle', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Oud Velvet detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v6-1', title: '1oz', price: 32, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v6-2', title: '2oz', price: 56, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
      { id: 'v6-4', title: '4oz', price: 98, availableForSale: false, selectedOptions: [{ name: 'Size', value: '4oz' }] },
    ],
    scentFamily: 'Oud',
    inspiredBy: 'Tom Ford Tobacco Oud',
    tags: ['mens', 'unisex'],
  },
  {
    id: 'p7',
    handle: 'jasmine-noir',
    title: 'Jasmine Noir',
    description:
      'Night-blooming jasmine layered over creamy tuberose and a whisper of black pepper. Hypnotic, opulent, slightly dangerous.',
    price: 34,
    currencyCode: 'USD',
    images: [
      { url: img('1615634260167-c8cdede054de'), altText: 'Jasmine Noir', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Jasmine Noir close', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'Jasmine Noir lifestyle', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Jasmine Noir detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v7-1', title: '1oz', price: 26, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v7-2', title: '2oz', price: 44, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
    ],
    scentFamily: 'Floral',
    inspiredBy: 'Tom Ford Black Orchid',
    tags: ['womens'],
    isNew: true,
  },
  {
    id: 'p8',
    handle: 'sea-fig',
    title: 'Sea Fig',
    description:
      'A salt-air aquatic spliced with creamy fig leaves and warm sand. Imagine the Amalfi coast at sundown — clean, briny, mouthwatering.',
    price: 28,
    currencyCode: 'USD',
    images: [
      { url: img('1610461888750-10bfc601b874'), altText: 'Sea Fig', width: 1200, height: 1500 },
      { url: img('1615634260167-c8cdede054de'), altText: 'Sea Fig close', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Sea Fig lifestyle', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Sea Fig detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v8-1', title: '1oz', price: 22, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v8-2', title: '2oz', price: 38, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
    ],
    scentFamily: 'Aquatic',
    inspiredBy: 'Le Labo Fig 13',
    tags: ['unisex'],
  },
  {
    id: 'p9',
    handle: 'bergamot-cardamom',
    title: 'Bergamot Cardamom',
    description:
      'A spirited fougère — cool bergamot meets warm green cardamom, finished with vetiver and a clean white-amber drydown.',
    price: 30,
    currencyCode: 'USD',
    images: [
      { url: img('1594035910387-fea47794261f'), altText: 'Bergamot Cardamom', width: 1200, height: 1500 },
      { url: img('1615634260167-c8cdede054de'), altText: 'Bergamot Cardamom close', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'Bergamot Cardamom lifestyle', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Bergamot Cardamom detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v9-1', title: '1oz', price: 24, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v9-2', title: '2oz', price: 42, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
      { id: 'v9-4', title: '4oz', price: 76, availableForSale: true, selectedOptions: [{ name: 'Size', value: '4oz' }] },
    ],
    scentFamily: 'Fresh',
    inspiredBy: 'Jo Malone Wood Sage',
    tags: ['mens', 'unisex'],
  },
  {
    id: 'p10',
    handle: 'leather-tobacco',
    title: 'Leather & Tobacco',
    description:
      'A rugged, smoky leather laced with cured tobacco leaf and dark rum. Vintage masculinity, modernised.',
    price: 38,
    currencyCode: 'USD',
    images: [
      { url: img('1541643600914-78b084683601'), altText: 'Leather Tobacco', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'Leather Tobacco close', width: 1200, height: 1500 },
      { url: img('1615634260167-c8cdede054de'), altText: 'Leather Tobacco lifestyle', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'Leather Tobacco detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v10-1', title: '1oz', price: 30, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v10-2', title: '2oz', price: 52, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
      { id: 'v10-4', title: '4oz', price: 92, availableForSale: true, selectedOptions: [{ name: 'Size', value: '4oz' }] },
    ],
    scentFamily: 'Woody',
    inspiredBy: 'Tom Ford Tuscan Leather',
    tags: ['mens'],
  },
  {
    id: 'p11',
    handle: 'white-musk-pear',
    title: 'White Musk & Pear',
    description:
      'A luminous, second-skin musk threaded with crisp anjou pear and a touch of freesia. Elegant minimalism in a bottle.',
    price: 26,
    currencyCode: 'USD',
    images: [
      { url: img('1615634260167-c8cdede054de'), altText: 'White Musk Pear', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'White Musk Pear close', width: 1200, height: 1500 },
      { url: img('1594035910387-fea47794261f'), altText: 'White Musk Pear lifestyle', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'White Musk Pear detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v11-1', title: '1oz', price: 22, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v11-2', title: '2oz', price: 38, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
    ],
    scentFamily: 'Floral',
    inspiredBy: 'Glossier You',
    tags: ['womens', 'unisex'],
  },
  {
    id: 'p12',
    handle: 'saffron-honey',
    title: 'Saffron & Honey',
    description:
      'Spiced saffron threads dissolved into raw orange-blossom honey, with a soft sandalwood base. Decadent, golden, warm.',
    price: 40,
    currencyCode: 'USD',
    images: [
      { url: img('1594035910387-fea47794261f'), altText: 'Saffron Honey', width: 1200, height: 1500 },
      { url: img('1615634260167-c8cdede054de'), altText: 'Saffron Honey close', width: 1200, height: 1500 },
      { url: img('1592945403244-b3fbafd7f539'), altText: 'Saffron Honey lifestyle', width: 1200, height: 1500 },
      { url: img('1610461888750-10bfc601b874'), altText: 'Saffron Honey detail', width: 1200, height: 1500 },
    ],
    variants: [
      { id: 'v12-1', title: '1oz', price: 32, availableForSale: true, selectedOptions: [{ name: 'Size', value: '1oz' }] },
      { id: 'v12-2', title: '2oz', price: 56, availableForSale: true, selectedOptions: [{ name: 'Size', value: '2oz' }] },
      { id: 'v12-4', title: '4oz', price: 98, availableForSale: true, selectedOptions: [{ name: 'Size', value: '4oz' }] },
    ],
    scentFamily: 'Oriental',
    inspiredBy: 'Maison Francis Kurkdjian Baccarat Rouge',
    tags: ['womens', 'unisex', 'best-seller'],
    isNew: true,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { name: "Women's Scents",  slug: 'womens',      imageUrl: '/images/category_womens_fragrance_retry_1778781640503.png' },
  { name: "Men's Scents",    slug: 'mens',        imageUrl: '/images/category_mens_fragrance_1778780026029.png' },
  { name: 'Unisex',          slug: 'unisex',      imageUrl: '/images/category_unisex_fragrance_1778781036963.png' },
  { name: 'Oud & Oriental',  slug: 'oud',         imageUrl: '/images/category_oud_oriental_fragrance_1778781746608.png' },
  { name: 'Home Fragrance',  slug: 'home',        imageUrl: img('1594035910387-fea47794261f', 800, 1000) },
  { name: 'Bottles & Accessories',  slug: 'accessories', imageUrl: img('1541643600914-78b084683601', 800, 1000) },
];

export const MOCK_SCENT_STORIES: ScentStoryData[] = [
  {
    name: 'Muted Forest',
    description:
      'Vetiver, cedarwood and ancient mossy notes — a serene woodland captured at dawn. Inspired by Tom Ford Oud Wood.',
    ctaText: 'Shop This Scent',
    imageUrl: '/images/scent_muted_forest.png',
    reverse: false,
    background: 'cream',
  },
  {
    name: 'Vanilla Ember',
    description:
      'Creamy bourbon vanilla wrapped around smoky sandalwood and caramelised amber. A signature gourmand for after dark.',
    ctaText: 'Shop This Scent',
    imageUrl: '/images/collection_bottles_amber.png',
    reverse: true,
    background: 'white',
  },
  {
    name: 'Rose Noir',
    description:
      'Bulgarian damascena rose woven through dewy jasmine and a kiss of bergamot. A modern, luminous floral that flatters the skin.',
    ctaText: 'Shop This Scent',
    imageUrl: '/images/scent_floral_pink.png',
    reverse: false,
    background: 'cream',
  },
];
