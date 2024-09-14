<template>
  <div class="form-inputs">
    <base-dialog-quick-form
      v-if="withQuickAdd"
      v-model="show"
      v-bind="dialogAttrs"
      @onComplete="onComplete"
    />
    <div :class="labelClass">
      {{ label }}
      <span class="text-error" v-if="$attrs.required">*</span>
    </div>
    <v-autocomplete
      :bg-color="$attrs.disabled ? 'grey' : backgroundColor"
      solo
      hide-details="auto"
      flat
      class="viana-form"
      variant="outlined"
      v-model="vModel"
      v-bind="$attrs"
      :items="items"
      :chips="multiple"
      :multiple="multiple"
      :density="density"
    >
      <template #label>
        <slot name="label"> </slot>
      </template>
      <template #prepend-item>
        <div v-if="addFunction || withQuickAdd" class="mt-2 px-2 text-center">
          <v-btn
            v-if="typeof addFunction == 'function'"
            elevation="0"
            block
            :color="'#a0ffd7'"
            @click="addFunction(search)"
          >
            <v-icon small>mdi-plus</v-icon>
            {{ addText }}
          </v-btn>
          <v-btn
            v-else-if="withQuickAdd"
            elevation="0"
            block
            :color="'#a0ffd7'"
            @click="show = true"
          >
            <v-icon small>mdi-plus</v-icon>
            {{ addText }}
          </v-btn>
        </div>
        <v-list-item
          v-if="multiple && withSelectAll && items?.length"
          class="cursor-pointer"
          @click="selectAll"
        >
          {{ isAllSelected ? "حذف همه" : "انتخاب همه" }}
        </v-list-item>
      </template>
      <template
        v-if="$attrs.chips"
        #selection="{ item, index, selected, attrs }"
      >
        <v-chip
          v-if="index < MAX_SHOWN_CHIPS"
          v-bind="attrs"
          :input-value="selected"
          close
          @click:close="remove(item)"
          color="var(--primary)"
          dark
          small
        >
          {{ item[$attrs.itemText] }}
        </v-chip>
        <small v-else-if="index == MAX_SHOWN_CHIPS">
          (+{{ vModel.length - MAX_SHOWN_CHIPS }} مورد دیگر)
        </small>
      </template>
      <template #append-item></template>
      <template #no-data>
        <v-list-item>
          <small> موردی برای نمایش وجود ندارد </small>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
  import { autoModel } from "@/mixins/auto-model";

  const MAX_SHOWN_CHIPS = 4;

  export default {
    mixins: [autoModel()],
    data() {
      return {
        MAX_SHOWN_CHIPS,
        show: false,
      };
    },
    props: {
      value: {
        required: true,
      },
      label: {
        type: String,
        required: false,
      },
      backgroundColor: {
        type: String,
        default: "grey-lighten-3",
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      withSelectAll: {
        type: Boolean,
        default: false,
      },
      addFunction: {
        type: Function | undefined,
        default: undefined,
      },
      withQuickAdd: {
        type: Boolean,
        default: false,
      },
      addText: {
        type: String,
        default: "اضافه کردن",
      },
      items: {
        type: Array,
        required: true,
      },
      density: {
        type: String,
        default: "compact",
      },
      labelClass: {
        type: String,
        default: "grey--text text-right",
      },
      classInput: {
        type: String,
        default: "default-input",
      },
      fatherClass: {
        type: String,
        default: "",
      },

      /**
       * @property {Object} schema - formbase schema
       * @property {String} service - Service
       * @property {String} [method] - method of service (default = 'create')
       * @property {String} [label] - title label
       */
      dialogAttrs: {
        type: Object,
        default: () => {},
      },
    },
    methods: {
      remove(item) {
        this.vModel = this.vModel.filter(
          (val) => val !== item[[this.$attrs.itemValue]],
        );
      },
      selectAll() {
        if (this.vModel?.length == this.items?.length) this.vModel = [];
        else
          this.vModel = this.items.map((item) => item[this.$attrs.itemValue]);
      },
      onComplete(data) {
        this.items.push(Array.isArray(data) ? data[0] : data);
        this.vModel = data[this.$attrs.itemValue];
      },
    },
    computed: {
      isAllSelected() {
        return this.items?.length == this.vModel.length;
      },
    },
  };
</script>
