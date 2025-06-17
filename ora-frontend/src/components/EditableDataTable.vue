<template>
  <div>
    <el-select v-model="pageSize" placeholder="Select" style="margin-bottom: 20px">
      <el-option
        v-for="size in [10, 25, 50, 100]"
        :key="size"
        :label="`${size} items per page`"
        :value="size"
      >
      </el-option>
    </el-select>

    <div class="table-loading-container" v-loading="loading">
      <div class="scroll-container" @scroll="handleScroll">
        <el-table :data="pagedTableData" style="width: 100%">
          <el-table-column label="ID" width="120">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(header, index) in tableHeaders"
            :key="index"
            :prop="header.key"
            :label="header.label"
            :width="250"
          />
          <el-table-column fixed="right" label="Operations" width="250">
            <template #default="{ row }">
              <div class="operations-grid">
                <el-button type="text" @click="showDetails(row)">Afficher</el-button>
                <el-button type="text" @click="editItem(row)">Modifier</el-button>
                <el-button type="text" @click="archiveItem(row)">Historiser</el-button>
                <el-button type="text" @click="deleteItem(row)">Supprimer</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'

export default {
  props: {
    tableData: Array
  },
  setup(props) {
    const pageSize = ref(10)
    const loading = ref(false)
    const pagedTableData = ref([])
    const lastVisibleIndex = ref(0) // Indice du dernier élément vu avant le chargement
    const canLoadMore = ref(true)

    onMounted(() => {
      loadMoreData()
    })

    const tableHeaders = computed(() => {
      return props.tableData.length > 0
        ? Object.keys(props.tableData[0]).map((key) => ({
            key: key,
            label: key.charAt(0).toUpperCase() + key.slice(1)
          }))
        : []
    })

    const loadMoreData = () => {
      if (loading.value || !canLoadMore.value) return

      // Capture la position actuelle de défilement avant de charger plus de données
      const container = document.querySelector('.scroll-container')
      const scrollTopBeforeLoading = container ? container.scrollTop : 0

      loading.value = true
      setTimeout(() => {
        const startIndex = pagedTableData.value.length // Avant de charger plus de données
        const nextItems = props.tableData.slice(startIndex, startIndex + pageSize.value)

        pagedTableData.value = [...pagedTableData.value, ...nextItems]

        loading.value = false
        canLoadMore.value = pagedTableData.value.length < props.tableData.length

        nextTick(() => {
          // Restaure la position de défilement précédente pour éviter le défilement automatique
          if (container) {
            container.scrollTop = scrollTopBeforeLoading
          }
        })
      }, 500)
    }

    const showDetails = (row) => {
      console.log('Afficher les détails de', row)
      // Logique pour afficher les détails
    }

    const editItem = (row) => {
      console.log('Modifier', row)
      // Logique pour modifier
    }

    const archiveItem = (row) => {
      console.log('Historiser', row)
      // Logique pour archiver/historiser
    }

    const deleteItem = (row) => {
      console.log('Supprimer', row)
      // Logique pour supprimer
    }

    const handleScroll = (event) => {
      const { target } = event
      const isAtBottom = target.scrollHeight - Math.ceil(target.scrollTop) <= target.clientHeight

      if (isAtBottom && !loading.value) {
        lastVisibleIndex.value = pagedTableData.value.length - 1
        loadMoreData()
      } else {
        canLoadMore.value = true
      }
    }

    return {
      tableHeaders,
      pageSize,
      pagedTableData,
      loading,
      handleScroll,
      showDetails,
      editItem,
      archiveItem,
      deleteItem
    }
  }
}
</script>


<style scoped>
.el-table {
  overflow-y: auto;
}

.scroll-container {
  max-height: 400px; /* Ajustez en fonction de vos besoins */
  overflow-y: auto;
}

.table-loading-container {
  position: relative; /* Nécessaire pour le positionnement correct de l'overlay de chargement */
}

.operations-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}

.operations-grid .el-button {
  margin: 2px; /* Ajustez l'espacement autour des boutons */
  flex-basis: calc(
    50% - 4px
  ); /* Ajustez pour l'espacement, assurez-vous que deux boutons tiennent sur une ligne */
}
</style>
