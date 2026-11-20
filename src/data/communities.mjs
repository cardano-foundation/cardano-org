//
// Community channels shown on /community.
//
// To list a community, add one object to COMMUNITIES and open a pull
// request. The requirements are in /docs/get-involved/add-community.
//
//   id        unique, lowercase letters, digits and hyphens
//   name      the name as the community writes it
//   url       https link to the channel
//   platform  forum, discord, telegram, reddit, stackexchange or facebook
//   group     channel  global channel, shown on the platform cards
//             local    language or regional group
//             support  moderation contact
//   language  ISO 639-1 code from LANGUAGE_NAMES, for a language group
//   region    key of a region label on the page, for a regional group
//
// A local group carries either language or region, never both. Run
// `yarn test:community` after editing.
//
export const FORUM_URL = 'https://forum.cardano.org';

export const LANGUAGE_NAMES = {
  vi: 'Tiếng Việt',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  nl: 'Nederlands',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  id: 'Bahasa Indonesia',
  it: 'Italiano',
  ru: 'Русский',
  tr: 'Türkçe',
};

export const COMMUNITIES = [
  { id: 'forum', name: 'forum.cardano.org', url: FORUM_URL, platform: 'forum', group: 'channel' },
  { id: 'reddit', name: 'r/Cardano', url: 'https://www.reddit.com/r/cardano/', platform: 'reddit', group: 'channel' },
  { id: 'stackexchange', name: 'Cardano Stack Exchange', url: 'https://cardano.stackexchange.com', platform: 'stackexchange', group: 'channel' },
  { id: 'facebook', name: 'Cardano Community Group', url: 'https://www.facebook.com/groups/CardanoCommunity/', platform: 'facebook', group: 'channel' },
  { id: 'telegram-main', name: 'Cardano Main', url: 'https://t.me/Cardano', platform: 'telegram', group: 'channel' },
  { id: 'telegram-developers', name: 'Cardano Developers', url: 'https://t.me/CardanoDevelopersOfficial', platform: 'telegram', group: 'channel' },
  { id: 'discord-foundation', name: 'Cardano Foundation Discord', url: 'https://discord.gg/MmeqpAzKbp', platform: 'discord', group: 'channel' },
  { id: 'discord-community', name: 'Cardano Community Discord', url: 'https://discord.com/invite/2nPUa5d7DE', platform: 'discord', group: 'channel' },

  { id: 'telegram-report-to-admin', name: 'Cardano Report to Admin', url: 'https://t.me/cardanoreporttoadmin', platform: 'telegram', group: 'support' },

  { id: 'telegram-vietnam', name: 'Cardano Vietnam', url: 'https://t.me/CardanoVNCommunity', platform: 'telegram', group: 'local', language: 'vi' },
  { id: 'telegram-japan', name: 'Cardano Japan', url: 'https://t.me/CardanoJapanOfficial', platform: 'telegram', group: 'local', language: 'ja' },
  { id: 'telegram-japan-trading', name: 'Cardano Japan Trading', url: 'https://t.me/CardanoJapanTrading', platform: 'telegram', group: 'local', language: 'ja' },
  { id: 'telegram-korea', name: 'Cardano Korea', url: 'https://t.me/CardanoKoreaOfficial', platform: 'telegram', group: 'local', language: 'ko' },
  { id: 'telegram-korea-trading', name: 'Cardano Korea Trading', url: 'https://t.me/CardanoKoreaTrading', platform: 'telegram', group: 'local', language: 'ko' },
  { id: 'telegram-china', name: 'Cardano China', url: 'https://t.me/CardanoChinaOfficial', platform: 'telegram', group: 'local', language: 'zh' },
  { id: 'telegram-dutch', name: 'Cardano Dutch and Flemish Official', url: 'https://t.me/CardanoDutchOfficial', platform: 'telegram', group: 'local', language: 'nl' },
  { id: 'telegram-german', name: 'Cardano German', url: 'https://t.me/CardanoGermanOfficial', platform: 'telegram', group: 'local', language: 'de' },
  { id: 'telegram-german-trading', name: 'Cardano German Trading', url: 'https://t.me/cardanotradinggerman', platform: 'telegram', group: 'local', language: 'de' },
  { id: 'telegram-spanish', name: 'Cardano Spanish Official', url: 'https://t.me/CardanoSpanishOfficial', platform: 'telegram', group: 'local', language: 'es' },
  { id: 'telegram-spain', name: 'Cardano Spain', url: 'https://t.me/CardanoEsp', platform: 'telegram', group: 'local', language: 'es' },
  { id: 'telegram-portuguese', name: 'Cardano Portuguese Official', url: 'https://t.me/CardanoPortugueseOfficial', platform: 'telegram', group: 'local', language: 'pt' },
  { id: 'telegram-indonesia', name: 'Cardano Indonesia', url: 'https://t.me/CardanoIndonesiaOfficial', platform: 'telegram', group: 'local', language: 'id' },
  { id: 'telegram-italy', name: 'Cardano Italy', url: 'https://t.me/CardanoIT', platform: 'telegram', group: 'local', language: 'it' },
  { id: 'telegram-russia', name: 'Cardano Russia', url: 'https://t.me/cardano_rus', platform: 'telegram', group: 'local', language: 'ru' },
  { id: 'telegram-russian-developers', name: 'Cardano Russian Developers', url: 'https://t.me/CardanoRussianMain', platform: 'telegram', group: 'local', language: 'ru' },
  { id: 'telegram-turkey', name: 'Cardano Turkey', url: 'https://t.me/CardanoTurk', platform: 'telegram', group: 'local', language: 'tr' },
  { id: 'telegram-uk', name: 'Cardano UK', url: 'https://t.me/CardanoUK', platform: 'telegram', group: 'local', region: 'uk' },
];

// Entries of one group in file order, optionally narrowed to a platform.
export function getByGroup(group, platform) {
  return COMMUNITIES.filter((c) => c.group === group && (!platform || c.platform === platform));
}

// Local groups split into those in the page language and the rest. English
// has no group of its own, so `own` is empty there.
export function getLocalGroups(locale) {
  const local = getByGroup('local');
  return {
    own: local.filter((c) => c.language === locale),
    others: local.filter((c) => c.language !== locale),
  };
}
