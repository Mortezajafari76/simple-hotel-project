<template>
  <client-only>
    <v-app>
      <admin-panel-header v-if="$vuetify.display.smAndDown" />
      <!-- <NotificationsDialog ref="notificationsDialogRef" /> -->
      <div class="default-main panel">
        <base-dialog-confirm>
          <v-container fluid class="d-flex">
            <v-row class="overflow-clip">
              <v-col md="3" lg="2" sm="4" class="ma-0 pl-0 hidden-sm-and-down">
                <admin-panel-drawer-desktop />
              </v-col>
              <v-col cols="12" md="9" lg="10">
                <slot />
              </v-col>
            </v-row>
          </v-container>
        </base-dialog-confirm>
      </div>
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
    data() {
      return {
        drawer: false,
      };
    },
  };
</script>

<style scoped>
  .default-main {
    background: #f9f9f9;
  }
</style>
