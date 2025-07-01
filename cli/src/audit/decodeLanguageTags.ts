export function decodeLanguageTags(encoded: string): string {
  let decoded = '';
  for (const char of encoded) {
    const codePoint = char.codePointAt(0);

    if (codePoint === undefined) {
      continue;
    }

    const asciiCodePoint = codePoint - 0xe0000;

    if (asciiCodePoint > 0 && asciiCodePoint <= 0x7f) {
      decoded += String.fromCodePoint(asciiCodePoint);
    }
  }
  return decoded;
}

export function encodeLanguageTags(text: string): string {
  let encoded = String.fromCodePoint(0xe0001);
  for (const char of text) {
    const codePoint = char.codePointAt(0);

    if (codePoint === undefined) {
      continue;
    }

    let asciiCodePoint: number | undefined;

    if (codePoint > 0 && codePoint <= 0x7f) {
      asciiCodePoint = codePoint + 0xe0000;
    }

    if (asciiCodePoint && asciiCodePoint > 0xe0001 && asciiCodePoint < 0xe007f) {
      encoded += String.fromCodePoint(asciiCodePoint);
    }
  }
  return encoded;
}
