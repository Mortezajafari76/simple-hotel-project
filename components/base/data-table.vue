<template>
  <v-skeleton-loader v-if="loading" type="table" />
  <v-data-table
    v-else
    id="table-card"
    :headers="mapHeaders"
    :items="items"
    :page="page"
    :items-per-page="itemsPerPage"
    :items-length="page * itemsPerPage"
    :hide-default-footer="true"
  >
    <!-- :page="page % 10 != 0 ? page % 10 : 10" -->
    <template #headers>
      <tr class="data-table-search">
        <th
          v-for="(header, i) in mapHeaders"
          :key="header.text ?? `table-header-${i}`"
          class="border-0"
        >
          <form-text-field
            v-if="header.hasSearch"
            v-model="search[header.value]"
            density="compact"
            hide-details
            :label="header.title"
            variant="solo"
            flat
          ></form-text-field>
        </th>
      </tr>
      <v-data-table-headers></v-data-table-headers>
    </template>

    <template
      v-if="items?.length > 0"
      #item="{ item: row, isExpanded, expand, index, isSelected, select }"
    >
      <tr>
        <td v-if="isSelectable">
          <v-checkbox
            class="pa-0 ma-0"
            hide-details
            :input-value="isSelected"
            @change="select"
          />
        </td>

        <slot name="content" :row="row" :index="index">
          <td v-for="(item, i) in headersExceptLastOne" :key="'data-' + i">
            <!-- 
                we have slot for each row column value item...

                @example: if you have a column with value 'user.full_name' then you have 'user-full_name' slot name 
                which can be used like <template #user-full_name="{ row }">{{ row }}</template>
               -->
            <slot :name="item?.value.replaceAll('.', '-')" :row="row">
              <!-- <v-edit-dialog
                  :return-value.sync="row[item.value]"
                  @save="save"
                >
                  <template v-slot:input>
                    <v-text-field
                      :value="row[item.value]"
                      label="Edit"
                      single-line
                      counter
                    ></v-text-field>
                    <v-btn> ثبت </v-btn>
                  </template>

                  <component
                    :is="item.component ?? 'span'"
                    v-bind="item.attributes"
                    v-on="item.on"
                    :color="getColor(row, item)"
                  >
                    {{
                      getValue(row, item, i, index + (page - 1) * itemsPerPage)
                    }}
                  </component>
                </v-edit-dialog> -->

              <status-btn
                v-if="item.component == 'status-btn'"
                :item="row"
                v-bind="item.attributes"
                @afterChangeStatus="$emit('afterChangeStatus', $event)"
              />

              <component
                v-else
                :is="item.component ?? 'span'"
                v-bind="item.attributes"
                v-on="item.on"
                :color="getColor(row, item)"
              >
                {{ getValue(row, item, i, index + (page - 1) * itemsPerPage) }}
              </component>
            </slot>
          </td>
        </slot>

        <td v-if="hasButtons">
          <slot name="edit" :row="row">
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  dark
                  icon
                  size="x-small"
                  elevation="0"
                  color="primary"
                  class="rounded"
                  v-if="hasEdit"
                  @click="onEditClick(row)"
                >
                  <v-icon dark>mdi-pen</v-icon>
                </v-btn>
              </template>
              <span>ویرایش</span>
            </v-tooltip>
          </slot>

          <slot name="buttons" :row="row"></slot>

          <slot name="delete" :row="row">
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-btn
                  v-if="hasDelete"
                  v-bind="props"
                  icon
                  size="x-small"
                  elevation="0"
                  color="error"
                  class="rounded"
                  @click="$emit('onDeleteClick', row)"
                >
                  <v-icon dark>mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ deleteText }}</span>
            </v-tooltip>
          </slot>
        </td>

        <td v-if="showExpand">
          <v-btn x-small icon fab @click="expand(!isExpanded)">
            <v-icon>
              {{ isExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
          </v-btn>
        </td>
      </tr>
    </template>

    <template #bottom>
      <span />
    </template>
  </v-data-table>
  <v-pagination
    v-if="pagesCount > 1 && paginationEnabled"
    :model-value="page"
    :length="pagesCount"
    total-visible="5"
    class="table-pagination"
    @update:model-value="handlePageChange"
  />
</template>

<script>
  import { autoModel } from "@/mixins/auto-model";
  import { table } from "@/mixins/table";

  export default {
    mixins: [autoModel(), table],
    data() {
      return {
        search: {},
        itemsPerPage: 20,
        page: this.$route.query?.page ? +this.$route.query?.page : 1,
      };
    },
    props: {
      /**
       * headers Object walkthrough
       * @typedef Header
       *
       * @property {string} text                  - table heading text
       * @property {string} align                 - table heading alignment
       * @property {string} value                 - pick value from main object which is passed through data table (accept dotted values like 'user.full_name')
       * @property {Function} [conditionalValue]  - (optional) pick value from defined condition inside parent component
       * @property {string} [hasSearch]           - (optional) defines wether a field has top search or not
       * @property {string} [type]                - (optional) defines some custom changes on text (see 'getValueFromType' function)
       * @property {string} [dateFormat]          - (optional) define moment format if it is needed
       * @property {string} [postfix]             - (optional) add a postfix text after the value text
       *
       * @property {string} [component]           - (optional) define render component inside data table
       * @property {Object<any>} [attributes]     - (optional) render component attributes
       * @property {Object<any>} [on]             - (optional) render component events
       *
       */

      /**
       * @type {Array<Header>}
       */
      headers: {
        required: true,
        type: Array,
      },
      headerProps: {
        type: Object,
        default: () => ({
          sortByText: "مرتب سازی بر اساس",
        }),
      },
      items: {
        required: true,
        type: Array,
      },
      paginationEnabled: {
        type: Boolean,
        default: true,
      },
      pagesLength: {
        type: Number,
        default: 1,
      },
      isShowGroup: {
        required: false,
        default: false,
        type: Boolean,
      },
      hasEdit: {
        required: false,
        default: true,
        type: Boolean,
      },
      hasDelete: {
        required: false,
        default: true,
        type: Boolean,
      },
      groupBy: {
        required: false,
      },
      isSelectable: {
        required: false,
        default: false,
        type: Boolean,
      },
      singleSelect: {
        required: false,
        default: false,
        type: Boolean,
      },
      itemKey: {
        required: false,
      },
      deleteText: {
        required: false,
        default: "حذف",
        type: String,
      },
      hasButtons: {
        type: Boolean,
        default: true,
      },
      showExpand: {
        type: Boolean,
        default: false,
      },
      singleExpand: {
        type: Boolean,
        default: false,
      },
      localPagination: {
        type: Boolean,
        default: false,
      },
      withRowNumber: {
        type: Boolean,
        default: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      selected(value) {
        this.$emit("onSelectedChange", value);
      },

      items() {
        this.selected = [];
      },

      "$route.query"() {
        this.page = this.$route.query?.page ? +this.$route.query?.page : 1;
      },

      search() {
        this.page = 1;
      },

      pagesLength() {
        console.log(this.pagesLength);
        window.scrollTo({ top: 0 });
        if (this.localPagination)
          this.page = this.$route.query?.page ? +this.$route.query?.page : 1;
      },
    },
    computed: {
      mapHeaders() {
        const headers = [
          ...(this.withRowNumber
            ? [
                {
                  title: "row",
                  value: "row_number",
                  sortable: false,
                  conditionalValue: (_, i) => i + 1,
                },
              ]
            : []),
          ...this.headers,
          ...(this.hasButtons
            ? [
                {
                  title: "actions",
                  value: "actions",
                  sortable: false,
                },
              ]
            : []),
          ...(this.showExpand
            ? [
                {
                  title: "جزئیات",
                  value: "expand",
                  sortable: false,
                },
              ]
            : []),
        ];

        return headers.map((header) => ({
          ...header,
          align: header.align || "start",
        }));
      },
      headersExceptLastOne() {
        return this.hasButtons
          ? this.mapHeaders.slice(0, this.showExpand ? -2 : -1)
          : this.mapHeaders;
      },
      pagesCount() {
        if (!this.localPagination || this.search.length)
          return this.pagesLength;

        return this.itemsPerPage == "همه"
          ? 1
          : Math.ceil(this.items?.length / this.itemsPerPage);
      },
    },
    methods: {
      save(event) {
        console.log("event", event);
      },
      onEditClick(item) {
        this.$emit("onEditClick", item);
      },
      onPageCountChange(count) {
        if (!this.localPagination) return;

        this.pagesLength = count;
      },
      handlePageChange(page) {
        this.page = page;

        this.$router.replace({
          query: {
            ...this.$route.query,
            page,
          },
        });

        this.$emit("onPageChange", page);

        setTimeout(() => {
          const el = document.getElementById("table-card");
          el.scrollIntoView({ behavior: "smooth" });
        }, 1500);
      },
    },
  };
</script>

<style lang="scss">
  .data-table-search {
    --v-table-header-height: 0;
  }
</style>
