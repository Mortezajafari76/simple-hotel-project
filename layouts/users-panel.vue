<template>
  <client-only>
    <v-app>
      <v-main class="default-main">
        <confirm-dialog>
          <v-container>
            <v-row class="overflow-clip">
              <v-col cols="12"> </v-col>
              <v-col cols="12">
                <Nuxt />
              </v-col>
            </v-row>
          </v-container>
        </confirm-dialog>
        <home-footer />
      </v-main>
    </v-app>
  </client-only>
</template>

<script>
  import { layouts } from "@/mixins/layouts";

  export default {
    middleware: "authenticated",
    mixins: [layouts],
    mounted() {
      this.$vuetify.rtl = true;
    },
  };
</script>

<style scoped></style>
