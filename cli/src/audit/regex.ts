// Based on the Avoid Source Code Spoofing Proposal: https://www.unicode.org/L2/L2022/22007r2-avoiding-spoof.pdf
// TODO: Continue reading and implement the rest of the security report: https://www.unicode.org/reports/tr36/

import { regex } from 'regex';

// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7Bdeprecated%7D&esc=on&g=gc&i=
const deprecatedRegex = regex('g')`[\p{Deprecated}--[\u{e0001}]]++`;

// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7BCc%7D-%5B%5Ct%5Cn%5Cr%5D&esc=on&g=gc&i=
const controlCharRegex = regex('g')`[\p{Cc}--[\t\n\r]]++`;

// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7BCf%7D-%5Cp%7Bemoji_component%7D-%5B%5Cu00AD%5Cu200b-%5Cu200d%5Cu2060%5Cu180E%5D&esc=on&g=gc&i=
const formatCharactersRegex = regex(
  'g'
)`[\p{Cf}--\p{Emoji_Component}--[\u00AD\u200b-\u200d\u2060\u180e\u{e0001}]]++`;

// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7BCo%7D&esc=on&g=gc&i=
const privateUseRegex = regex('g')`\p{Co}++`;

// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7BCs%7D&esc=on&g=gc&i=
const surrogatesRegex = regex('g')`\p{Cs}++`;

// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7BCn%7D&g=gc&i=
const unassigedCodePointsRegex = regex('g')`\p{Cn}++`;

// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7BCn%7D&g=gc&i=
const misleadingWhitespaceRegex = regex(
  'g'
)`[[\p{White_Space}[\u115F\u1160\u3164\uFFA0]]--[\u0020\t\n\r]]++`;

// https://www.unicode.org/charts/PDF/UE0000.pdf
const languageTagsRegex = regex('gd')`(?<tag>[\u{e0000}-\u{e007d}]+)`;

export const regexTemplates = {
  'Deprecated Unicode characters': deprecatedRegex,
  'Control characters': controlCharRegex,
  'Format characters': formatCharactersRegex,
  'Private use characters': privateUseRegex,
  'Surrogates characters': surrogatesRegex,
  'Unassigned code points': unassigedCodePointsRegex,
  'Misleading whitespace': misleadingWhitespaceRegex,
  'Language tags': languageTagsRegex,
};
