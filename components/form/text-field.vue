<template>
  <div class="form-inputs text-right">
    <div :class="[labelClass, { 'text-center': centerText }]">
      {{ label }}
      <span class="text-error" v-if="$attrs.required">*</span>
    </div>
    <v-text-field
      class="viana-form"
      :bg-color="
        !noBackground
          ? $attrs.disabled
            ? 'grey-darken-2'
            : backgroundColor
          : undefined
      "
      hide-details="auto"
      :autofocus="focus"
      rounded="4"
      v-model="inputVal"
      v-bind="$attrs"
      label=""
      :density="density"
      :type="
        password ? (show_password ? 'text' : 'password') : $attrs.inputType
      "
      :append-icon="
        password
          ? show_password
            ? 'mdi-eye'
            : 'mdi-eye-off'
          : $attrs.appendIcon
      "
      @click:append="onAppendClick"
      variant="outlined"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show_password: false,
      };
    },
    props: {
      modelValue: {
        type: String,
        required: true,
      },
      centerText: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
        required: false,
      },
      password: {
        type: Boolean,
        default: false,
      },
      noBackground: {
        type: Boolean,
        default: false,
      },
      backgroundColor: {
        type: String,
        default: "grey-lighten-3",
      },
      focus: {
        type: Boolean,
        default: false,
      },
      labelClass: {
        type: String,
        default: "grey--text text-right",
      },
      density: {
        type: String,
        default: "compact",
      },
    },
    computed: {
      inputVal: {
        get() {
          return this.modelValue;
        },
        set(val) {
          this.$emit("update:modelValue", val?.trim());
        },
      },
    },
    methods: {
      onAppendClick() {
        this.show_password = !this.show_password;
      },
    },
  };
</script>

<style scoped>
  .text-right {
    text-align: right;
  }

  .text-center {
    text-align: center;
  }
</style>

<style>
  .text-field .v-label.v-field-label {
    color: black !important;
    opacity: 1;
  }
</style>
