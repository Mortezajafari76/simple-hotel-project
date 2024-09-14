export const makeModel = (schema) => {
  return Object.keys(schema).reduce(
    (obj, currentKey) => ({
      ...obj,
      [currentKey]: schema[currentKey]?.initValue ?? "",
    }),
    {},
  );
};

export const postPrepare = (model, withEmpties = false) => {
  let formData = new FormData();

  for (let key in model) {
    if (model[key] == null || model[key]?.length == 0) {
      if (withEmpties) formData.append(key, "");
      continue;
    }

    if (Array.isArray(model[key]) && model[key].length > 0) {
      if (model[key]["media"])
        formData.append(
          key,
          JSON.stringify(model[key].map((el) => el.media_id)),
        );
      else formData.append(key, JSON.stringify(model[key]));
    } else if (typeof model[key] == "string" && model[key].length > 0) {
      if (key.includes("price"))
        formData.append(key, model[key].replace(",", ""));
      else formData.append(key, model[key]);
    } else if (typeof model[key] == "number" && model[key] != 0)
      // formData.append(key, model[key] - 1);
      formData.append(key, model[key]);
    else if (
      //file
      typeof model[key] == "object" &&
      model[key].name &&
      model[key].type
    ) {
      formData.append(key, model[key]);
    }
  }

  return formData;
};

export const getPrepare = (response, model) => {
  let res = response?.data?.data
    ? response?.data?.data
    : response?.data?.length
    ? response?.data[0]
    : response?.data ?? response;
  for (const key in model) {
    if (Array.isArray(res[key]) && res[key].length > 0) {
      console.log("type array", res[key]);
      // model[key] = JSON.parse(res[key]);
      model[key] = res[key];
    } else if (typeof res[key] == "number") {
      // model[key] = res[key] + 1;
      model[key] = res[key];
    } else if (key == "status") {
      model[key] = res[key]?.name ?? res[key];
    } else if (res[key]) {
      model[key] = res[key];
    }
  }
};
