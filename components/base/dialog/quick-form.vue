<template>
  <v-dialog content-class="rounded-lg" v-model="vModel" width="800px">
    <v-card class="rounded-lg">
      <v-card-title class="d-flex">

        <v-btn small elevation="0" @click="vModel = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer />
        <p class="text-18 font-extra-bold primary-text">
          <slot> {{ label }} </slot>
        </p>
      </v-card-title>
      <v-card-text>
        <slot name="top" />

        <v-form ref="form" class="expand-width">
          <form-base
            :model="model"
            :schema="schema"
            :row="{ noGutters: false }"
          ></form-base>
          <span class="expand-width d-flex justify-end">
            <v-btn
              class="mt-2 px-8 default-input white--text"
              color="var(--primary)"
              dark
              @click="submit"
              elevation="0"
              :loading="loading"
              :block="$vuetify.display.xs"
            >
              <span class="text-white">submit</span>
            </v-btn>
          </span>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
  import { autoModel } from "@/mixins/auto-model";
  import VianaAxios from "@/constants/viana-axios";

  export default {
    mixins: [autoModel()],
    data() {
      return {
        loading: false,
        model: {},
      };
    },
    props: {
      item: {
        type: Object | null,
        default: null,
      },
      itemKey: {
        type: String,
        default: "id",
      },
      schema: {
        type: Object,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
      method: {
        type: String,
        default: "create",
      },
      label: {
        type: String,
        default: "",
      },
      prepareData: {
        type: Function | undefined,
        default: undefined,
      },
    },
    watch: {
      vModel() {
        this.model = makeModel(this.schema);

        if (this.item) getPrepare(this.item, this.model);
      },
    },
    methods: {
      async submit() {
        try {
          const { valid } = await this.$refs.form.validate();
          if (!valid) throw 600;

          if (!this.loading) this.loading = true;

          const data = new FormData();

          Object.entries(this.model).forEach(([key, value]) =>
            data.append(key, value),
          );

          if (this.prepareData) this.prepareData(data, this.model);

          const response = await VianaAxios.post(this.path,this.model);

          this.vModel = false;

          // showMessage(1004);

          this.$emit("onComplete", response?.data);
        } catch (error) {
          // showErrorMessage(error);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
