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
    path="/rooms"
    @onComplete="getList"
  >
    Create Room
  </base-dialog-quick-form>
  <base-data-table :items="items" :headers="headers"  @onDeleteClick="destroy" />
</template>

<script setup>
  import VianaAxios from "@/constants/viana-axios";

  const loading = ref(false);
  const items = ref([]);

  const show = ref(false);

  const schema = reactive({
    code: {
      type: "form-text-field",
      label: "code",
      required: true,
      col: { cols: 12, md: 6 },
    },
    status: {
      type: "form-auto-complete",
      label: "status",
      itemText: "title",
      itemValue: "id",
      items:[
        {'id':0,'title':'ready'},
        {'id':1,'title':'pending_cleanup'},
        {'id':2,'title':'reserved'},
      ],
      required: true,
      col: { cols: 12, md: 6 },
    },
  });

  const headers = [
    {
      title: "code",
      value: "code",
    },
    {
      title: "status",
      value: "status",
    },
  ];

  onMounted(() => {
    getList();
  });

  const getList = async () => {
    try {
      loading.value = true;
      const response = await VianaAxios.get("rooms");
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
      const response = await VianaAxios.delete(`rooms/${row.id}`);
    } catch (error) {
      console.log("error", error);
    } finally {
      loading.value = false;
    }
  };
</script>

<style></style>
