export const toUpper = (text: string): string => text.toUpperCase();

export const toLower = (text: string): string => text.toLowerCase();

export const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export const formatName = ({ first, last }: { first: string; last: string }): string =>
  `${first} ${last}`;