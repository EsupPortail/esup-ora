<template>
  <v-card
  :title="titleTable"
  flat
>
  <template v-slot:text>
    <v-text-field
      v-model="search"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      class="search-bar"
      single-line
      style="width: 25%"
    ></v-text-field>
  </template>
  <v-data-table
    :headers="generatedHeaders"
    :items="tableData"
    :items-per-page="itemsPerPage"
    :search="search"
    :rows-per-page-items="[3 ,6]"
    :class="{ 'v-data-table-striped': striped }"
    @update:items-per-page="updateItemsPerPage"
    @page-count="pageCount = $event"
    v-model:page="currentPage"
    v-model:sort-by="sortBy"
  >
    <template v-slot:item="{ item, index }">
      <tr :class="getRowClass(index)" style="height: 70px">
        <td v-for="(value, key) in item" :key="key">
          <template v-if="Array.isArray(value)">
            <div v-for="(element, index) in value" :key="`element-${index}`">
              {{ element }}
            </div>
            <v-btn v-if="!edition" size="x-small" style="margin-top: 10px;" color="success" @click="addParcours()">Ajouter un parcours</v-btn>
            <template v-else>
              <div style="display: table;">
                <div style="display: table-row;">
                  <v-text-field size="xs" v-model="parcoursName" style="height: 60px; width: 80%; display: table-cell; text-align: center; vertical-align: middle;" label="Nom parcours" @click="validateParcours( )"></v-text-field>
                  <div style="display: table-cell; padding: 0; width: 20%;">
                    <v-btn style="width: 100%; height: 100%; padding: 0; display: block; background-color: green;">
                      <v-icon icon="mdi-check" color="white"></v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            {{ value }}
          </template>
        </td>
        <td>
          <div class="action-buttons listActions">
            <v-btn small color="primary" size="x-small" class="mx-1" @click="showItem(item)">Afficher</v-btn>
            <v-btn small color="orange" size="x-small" class="mx-1" @click="editItem(item)">Modifier</v-btn>
            <v-btn small color="red" size="x-small" class="mx-1" @click="deleteItem(item)">Supprimer</v-btn>
          </div>
        </td>
      </tr>
    </template>
    <template style="margin-top: 10px" v-slot:footer.page-text="{ pageStart, pageStop }">
      <v-btn icon color="primary" @click="currentPage--">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      {{ pageStart }}-{{ pageStop }}
      <v-btn small color="orange" class="mx-1" @click="editItem(item)">Modifier</v-btn>
    </template>
  </v-data-table>
  </v-card>
</template>
<script>
export default {
  components: {},
  props: {
    tableData: {
      type: Array,
      required: true
    },
    striped: {
      type: Boolean,
      default: true
    },
    titleTable: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      itemsPerPage: 3,
      currentPage: 1,
      pageCount: 0,
      generatedHeaders: this.generateHeaders(),
      search: "",
      edition: false,
      parcoursName: "",
      sortBy: [{key: 'id', order: 'asc'}]
    }
  },
  created() {},
  methods: {
    updateItemsPerPage(newItemsPerPage) {
      this.itemsPerPage = newItemsPerPage
      this.currentPage = 1
    },
    generateHeaders() {
      if (this.tableData.length > 0) {
        this.generatedHeaders = Object.keys(this.tableData[0]).map((key) => ({
          text: this.formatHeader(key),
          value: key
        }))

        this.generatedHeaders.push({ text: 'Actions', value: 'actions' })
      }
    },
    formatHeader(text) {
      return text.replace(/_/g, ' ').replace(/(\b\w)/g, (s) => s.toUpperCase())
    },
    camelToTitleCase(str) {
      return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    },
    showItem(item) {
      alert(`Afficher les détails de ${item.code}`)
    },
    editItem(item) {
      alert(`Modifier ${item.code}`)
    },
    deleteItem(item) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${item.code}?`)) {
        console.log(item.code)
        delete tableData[code]
      }
    },
    getRowClass(index) {
      return index % 2 === 0 ? 'row-blue' : 'row-grey'
    },
    addParcours() {
      this.edition = true;
    }
  }
}
</script>

<style scoped>
.listActions {
  display: block !important;
  padding: 10px 0;
  text-align: center;
  height: 100%;
}

.listActions button {
  display: block;
  width: 110px !important;
  margin-top: 10px;
}


.row-blue {
  background-color: #e3f2fd;
}

.row-grey {
  background-color: #fafafa;
}
.action-buttons {
  display: flex;
  justify-content: center;
}
.v-btn {
  min-width: unset;
}

.search-bar {
  width: 50%;
}
</style>
