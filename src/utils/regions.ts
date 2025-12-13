export const REGION_MAP: { [nationality: string]: string } = {
  // UK & Ireland
  "England": "UK & Ireland",
  "Scotland": "UK & Ireland",
  "Wales": "UK & Ireland",
  "Northern Ireland": "UK & Ireland",
  "Ireland": "UK & Ireland",

  // Scandinavia
  "Sweden": "Scandinavia",
  "Norway": "Scandinavia",
  "Denmark": "Scandinavia",
  "Finland": "Scandinavia",
  "Iceland": "Scandinavia",

  // Western Europe
  "France": "Western Europe",
  "Germany": "Western Europe",
  "Netherlands": "Western Europe",
  "Belgium": "Western Europe",
  "Luxembourg": "Western Europe",
  "Austria": "Western Europe",
  "Switzerland": "Western Europe",

  // Southern Europe
  "Spain": "Southern Europe",
  "Portugal": "Southern Europe",
  "Italy": "Southern Europe",
  "Greece": "Southern Europe",
  "Malta": "Southern Europe",

  // Eastern Europe
  "Poland": "Eastern Europe",
  "Czech Republic": "Eastern Europe",
  "Slovakia": "Eastern Europe",
  "Hungary": "Eastern Europe",
  "Romania": "Eastern Europe",
  "Bulgaria": "Eastern Europe",
  "Ukraine": "Eastern Europe",
  "Belarus": "Eastern Europe",
  "Moldova": "Eastern Europe",

  // Balkan
  "Serbia": "Balkan",
  "Croatia": "Balkan",
  "Bosnia and Herzegovina": "Balkan",
  "Montenegro": "Balkan",
  "North Macedonia": "Balkan",
  "Albania": "Balkan",
  "Slovenia": "Balkan",
  "Kosovo": "Balkan",

  // South America
  "Brazil": "South America",
  "Argentina": "South America",
  "Colombia": "South America",
  "Uruguay": "South America",
  "Chile": "South America",

  // North America
  "USA": "North America",
  "Canada": "North America",
  "Mexico": "North America",

  // Africa
  "Ghana": "Africa",
  "Nigeria": "Africa",
  "Senegal": "Africa",
  "Egypt": "Africa",
  "Morocco": "Africa",

  // Asia
  "Japan": "Asia",
  "South Korea": "Asia",
  "China": "Asia",
  "Australia": "Asia", // Often grouped with Asia in football contexts
};

export const ALL_REGIONS = Array.from(new Set(Object.values(REGION_MAP))).sort();