// The hero photo, hotlinked from Wikimedia Commons via Special:FilePath so Commons
// serves an appropriately-sized thumbnail. A small enclosed 7-a-side-style synthetic
// pitch — deliberately not a stadium, to match the amateur pickup-game feel.

const commonsUrl = (file, width) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`

const filePageUrl = (file) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`

export const HERO_PHOTO = {
  file: 'Sam Kerr Football Centre, October 2024 09.jpg',
  author: 'Samuel Wiki',
  license: 'CC0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  url: filePageUrl('Sam Kerr Football Centre, October 2024 09.jpg'),
  at: (width) => commonsUrl('Sam Kerr Football Centre, October 2024 09.jpg', width),
}
