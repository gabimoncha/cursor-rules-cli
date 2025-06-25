import { decodeLanguageTags } from '~/audit/decodeLanguageTags.js';
import { regexTemplates } from './regex.js';
import { logger } from '~/shared/logger.js';

function matchTemplate(template: string, regex: RegExp, text: string) {
  let matched = false;
  let decoded = null;
  const matches = [...text.matchAll(regex)];

  if (!matches.length) return { matched: false, decoded };

  matched = true;

  logger.debug('\n===============================================');
  logger.debug('\nfound with:', template, regex);
  for (const match of matches) {
    const range = match?.indices?.groups?.tag;
    if (range?.length) {
      decoded = decodeLanguageTags(text.slice(range[0], range[1]));
    }
  }

  return { matched, decoded };
}

export function matchRegex(text: string) {
  return Object.entries(regexTemplates).reduce(
    (acc: Record<string, string | null>, [template, regex]) => {
      const { matched, decoded } = matchTemplate(template, regex, text);

      if (matched) {
        acc[template] = decoded;
      }

      return acc;
    },
    {}
  );
}
