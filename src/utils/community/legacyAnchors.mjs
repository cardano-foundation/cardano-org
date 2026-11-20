// Heading anchors of the retired Online Communities doc, in all five
// locales, mapped to the section ids of /community. The redirect from
// /docs/communities keeps the hash, so old deep links still arrive here.
// Keys are NFC, generated with github-slugger from the old headings.
export const LEGACY_ANCHORS = {
  'forums': 'channels',
  'foren': 'channels',
  'foros': 'channels',
  'フォーラム': 'channels',
  'diễn-đàn': 'channels',
  'events-and-local-gatherings': 'events',
  'veranstaltungen-und-lokale-treffen': 'events',
  'eventos-y-encuentros-locales': 'events',
  'イベントとローカルミートアップ': 'events',
  'các-sự-kiện-và-buổi-họp-mặt-địa-phương': 'events',
  'cardano-on-telegram': 'telegram',
  'cardano-auf-telegram': 'telegram',
  'cardano-en-telegram': 'telegram',
  'cardano-trên-telegram': 'telegram',
  'cardano-on-discord': 'discord',
  'cardano-auf-discord': 'discord',
  'cardano-en-discord': 'discord',
  'cardano-trên-discord': 'discord',
  'language-specific-discussions': 'local',
  'sprachspezifische-kanäle': 'local',
  'debates-en-idiomas-específicos': 'local',
  '言語別のディスカッション': 'local',
  'thảo-luận-cụ-thể-theo-ngôn-ngữ': 'local',
  'add-your-community': 'add',
  'community-hinzufügen': 'add',
  'añade-tu-comunidad': 'add',
  'コミュニティを追加する': 'add',
  'hãy-thêm-cộng-đồng-của-bạn': 'add',
};

// Takes the decoded id from hashTargetId. Returns the new section id, or
// null for anything that is not an old anchor.
export function resolveLegacyAnchor(id) {
  if (typeof id !== 'string') return null;
  const key = id.normalize('NFC');
  return Object.hasOwn(LEGACY_ANCHORS, key) ? LEGACY_ANCHORS[key] : null;
}
