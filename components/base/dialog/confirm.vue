<template>
  <span>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="d-flex"> هشدار </v-card-title>
        <v-card-text class="black-text">
          <span v-html="text" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="reject"> خیر </v-btn>
          <v-btn color="green darken-1" text @click="accept"> بله </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <slot />
  </span>
</template>

<script>
  export default {
    provide() {
      return {
        getConfirmation: this.getConfirmation,
      };
    },
    data: () => ({
      dialog: false,
      text: "",
      onConfirm: () => {},
    }),
    methods: {
      /**
       * triggers the confirmation dialog
       * @param {string} text - the text you want to show in the dialog (you can also pass HTML)
       * @param {function} onConfirm - callback function after clicking on confirm
       */
      getConfirmation: function (text, onConfirm = () => {}) {
        this.text = text;
        this.onConfirm = onConfirm;
        this.dialog = true;
      },
      close() {
        this.dialog = false;
        this.text = "";
        this.onConfirm = () => {};
      },
      accept: function () {
        this.onConfirm && this.onConfirm();
        this.close();
      },
      reject: function () {
        this.close();
      },
    },
  };
</script>

<style></style>
