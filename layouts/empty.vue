<template>
  <client-only>
    <v-app>
      <Transition name="fade">
        <v-main class="disable-bg">
          <Nuxt />
        </v-main>
      </Transition>
    </v-app>
  </client-only>
</template>

<script>
  import { layouts } from "@/mixins/layouts";
  export default {
    mixins: [layouts],
    computed: {
      isDark() {
        return this.$route.meta.darkHeader ?? false;
      },
    },
  };
</script>

<style scoped>
  .hidden {
    display: none;
  }

  .rtl {
    direction: rtl;
  }
  .ltr {
    direction: ltr;
  }
</style>
