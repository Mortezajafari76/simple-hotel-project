// use "vModel" as the regular v-model directive
// use "vModelName" as v-model:name directive. it concat the name after : to the end of vModel

import { capitalizeFirstLetter } from "@/utils/string";

export const autoModel = (name = "modelValue") => ({
  props: {
    [name]: {
      required: true,
    },
  },
  computed: {
    [`vModel${name != "modelValue" ? capitalizeFirstLetter(name.toLowerCase()) : ""}`]:
      {
        get() {
          return this[name];
        },
        set(value) {
          this.$emit(`update:${name}`, value);
        },
      },
  },
});
