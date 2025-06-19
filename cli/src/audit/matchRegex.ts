import { decodeLanguageTags } from '~/audit/decodeLanguageTags.js';
import { regexTemplates } from './regex.js';
import { logger } from "~/shared/logger.js";

function matchTemplate(template: string, regex: RegExp, text: string) {
  let matched = false;
  let decoded = '';
  const matches = [...text.matchAll(regex)];

  if (!matches.length) return { matched: false, decoded: '' };

  matched = true;

  for (const match of matches) {
    if ('indices' in match) {
      logger.debug('===============================================');
      logger.debug('\n\n\nfound with:', template, regex);

      const range = match?.indices?.groups?.tag
      if (range?.length) {

        decoded = decodeLanguageTags(text.slice(range[0], range[1]))
        logger.debug('\ndecoded:')
        logger.debug(decoded)
      }
    }
  }

  return { matched, decoded };
}

export function matchRegex(text: string) {
  return Object.entries(regexTemplates).reduce((acc: Record<string, boolean>, [key, regex]) => {
    const { matched, decoded } = matchTemplate(key, regex, text);

    acc[key] = matched;

    return acc;
  }, {});
}
