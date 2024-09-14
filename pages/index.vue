<template>
  <div class="d-flex justify-space-between">
    <v-btn color="success" to="/rooms"> Rooms </v-btn>

    <v-btn color="success" flat @click="show = true">
      <v-icon>mdi-plus</v-icon>
      create
    </v-btn>
  </div>
  <base-dialog-quick-form
    v-model="show"
    :schema="schema"
    path="/guests"
    @onComplete="getList"
  >
    Create Guest
  </base-dialog-quick-form>
  <base-data-table :items="items" :headers="headers" @onDeleteClick="destroy" />
</template>

<script setup>
  import VianaAxios from "@/constants/viana-axios";

  const loading = ref(false);
  const items = ref([]);

  const show = ref(false);

  const schema = reactive({
    first_name: {
      type: "form-text-field",
      label: "first name",
      required: true,
      col: { cols: 12, md: 6 },
    },
    last_name: {
      type: "form-text-field",
      label: "last name",
      required: true,
      col: { cols: 12, md: 6 },
    },
  });

  const headers = [
    {
      title: "first name",
      value: "first_name",
    },
    {
      title: "last name",
      value: "last_name",
    },
  ];

  onMounted(() => {
    getList();
  });

  const getList = async () => {
    try {
      loading.value = true;
      const response = await VianaAxios.get("guests");
      items.value = response.data.data;
    } catch (error) {
      console.log("error", error);
    } finally {
      loading.value = false;
    }
  };
  const destroy = async (row) => {
    try {
      loading.value = true;
      const response = await VianaAxios.delete(`guests/${row.id}`);
    } catch (error) {
      console.log("error", error);
    } finally {
      loading.value = false;
    }
  };
</script>

<style></style>
