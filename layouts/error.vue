<template>
  <client-only>
    <v-app dark>
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
          class="d-flex flex-column align-center justify-center"
        >
          <div class="error-font mb-4" v-if="error.statusCode === 404">
            {{ pageNotFound }}
          </div>
          <div class="error-font mb-4" v-else-if="error.statusCode === 500">
            {{ internalError }} - <small>{{ error?.message ?? error }}</small>
          </div>
          <div class="error-font mb-4" v-else>
            {{ otherError }}
          </div>
          <v-btn
            large
            width="11rem"
            elevation="0"
            color="var(--primary)"
            dark
            class="rounded-pill mb-4"
            :to="localePath('/')"
          >
            صفحه اصلی
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="d-flex align-center justify-center pa-16 pt-5"
        >
          <v-img
            v-if="error.statusCode === 404"
            :src="require('@/assets/img/404.svg')"
          >
          </v-img>
          <v-img
            v-else-if="error.statusCode === 500"
            :src="require('@/assets/img/500.svg')"
          >
          </v-img>
          <v-img v-else :src="require('@/assets/img/404.svg')"> </v-img>
        </v-col>
      </v-row>
    </v-app>
  </client-only>
</template>

<script>
  export default {
    props: {
      error: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        pageNotFound: "404 Not Found",
        internalError: "500",
        otherError: "An error occurred",
      };
    },
    head() {
      const title =
        this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
      return {
        title,
      };
    },
  };
</script>

<style scoped>
  .error-font {
    font-weight: 600;
    font-size: 3rem;
  }
</style>
