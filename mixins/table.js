import moment from "jalali-moment";

function getNestedProperty(obj, path) {
  const keys = path.split(".");
  let currentObj = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!currentObj?.hasOwnProperty(key)) {
      return undefined;
    }
    currentObj = currentObj[key];
  }
  return currentObj;
}

export const table = {
  methods: {
    getColor(row, item) {
      const color = item.attributes?.color;
      if (typeof color != "function") return color ?? "primary";
      return color(row);
    },
    getValue(row, item, columnIdx, rowIdx) {
      if (item.conditionalValue && typeof item.conditionalValue == "function") {
        return item.conditionalValue(row, rowIdx);
      } else if (item.value.includes(".")) {
        const property = getNestedProperty(row, item.value);
        return property
          ? this.getValueFromType(property, item)
          : item.default ?? "-";
      } else if (row[item.value])
        return this.getValueFromType(row[item.value], item);
      else return item.default ?? "-";
    },
    getValueFromType(text, item) {
      let finalText = "";

      switch (item?.type) {
        case "price":
          finalText = new Intl.NumberFormat().format(text);
          break;

        case "user_full_name":
          finalText = `${row[item.value]?.first_name ?? "-"} ${
            row[item.value]?.last_name ?? ""
          }`;
          break;

        case "date":
          finalText = moment(new Date(text)).format(
            item.dateFormat || "HH:mm jYYYY/jMM/jDD",
          );
          break;

        default:
          finalText = text;
          break;
      }

      finalText = (finalText + "")?.trim() || "-";

      if (item.prefix) finalText = `${item.prefix} ${finalText}`;
      if (item.postfix) finalText += ` ${item.postfix}`;

      return finalText;
    },
  },
};
