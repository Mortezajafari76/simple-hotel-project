export const filterNumber = (t) => {
  if (!t) return "";
  t += "";
  if (t.includes(",")) t = t.split(",").join("");
  if (!/^\d+$/.test(t)) {
    return t;
  }
  return "" + Intl.NumberFormat().format(+t);
};

export const makeSlug = (text) => text.replace(/\/|\s|\./g, "-").toLowerCase();

export const removeLastSlash = (routeUrl) =>
  routeUrl.length > 1 && routeUrl.slice(-1) == "/"
    ? routeUrl.slice(0, -1)
    : routeUrl;

export const toEnglishNumber = (value) => {
  if (typeof value == "number") return value.toFixed(0);
  if (!value?.length) return "";

  const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return (value + "").replaceAll(/[۰-۹]/g, (chr) => {
    const idx = persian.indexOf(chr);
    return idx >= 0 ? idx : chr;
  });
};

export const removeHTMLTags = (text) => {
  return text?.replace(/<\/?[^>]+(>|$)/g, " ").trim() || "";
};

export const capitalizeFirstLetter = (str) => {
  if (str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const pluralize = (word) => {
  // Handle irregular plurals
  const irregulars = {
    child: "children",
    man: "men",
    woman: "women",
    person: "people",
    mouse: "mice",
    goose: "geese",
    tooth: "teeth",
    foot: "feet",
  };

  if (irregulars[word.toLowerCase()]) return irregulars[word.toLowerCase()];

  // Words ending in -s, -x, -z, -ch, or -sh add -es
  if (/(s|x|z|ch|sh)$/i.test(word)) return word + "es";

  // Words ending in consonant + y change to -ies
  if (/[^aeiou]y$/i.test(word)) return word.replace(/y$/i, "ies");

  // Words ending in -f or -fe change to -ves
  if (/(f|fe)$/i.test(word)) return word.replace(/(f|fe)$/i, "ves");

  // Default rule: add -s
  return word + "s";
};

export default {
  filterNumber,
  makeSlug,
  removeLastSlash,
  toEnglishNumber,
  removeHTMLTags,
  capitalizeFirstLetter,
  pluralize,
};
