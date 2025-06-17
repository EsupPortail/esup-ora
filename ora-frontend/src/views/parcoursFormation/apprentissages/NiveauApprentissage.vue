<template>
  <v-card  class="elevation-3" v-if="refNiveau !== null">
    <v-card-title style="text-align: center">
      <v-row>
        <v-col>
          <h3 v-if="!enableEditLibelle">{{ refNiveau?.libelle ?? 'Débutant' }}</h3>
          <v-text-field
            v-else
            v-model="refNiveau.libelle"
            @keyup.enter="updateNiveauLibelle"
            variant="outlined"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn
            size="x-small"
            :icon="enableEditLibelle ? 'mdi-check' : 'mdi-pencil'"
            :color="enableEditLibelle ? 'success' : ''"
            @click="enableEditLibelle ? updateNiveauLibelle() : (enableEditLibelle = true)"
          ></v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col offset="1" cols="9">
          <h5
            v-if="!enableEditDescription"
            ref="descriptionRef"
            :style="
              valueToHave !== 0
                ? { height: heightPreference + 'px', maxHeight: heightPreference + 'px' }
                : { height: '50px', maxHeight: '50px' }
            "
            class="description-text"
          >
            {{ refNiveau.description }}
          </h5>
          <v-text-field
            v-else
            v-model="refNiveau.description"
            @keyup.enter="updateNiveauDescription"
            variant="outlined"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn
            size="x-small"
            :icon="enableEditDescription ? 'mdi-check' : 'mdi-pencil'"
            :color="enableEditDescription ? 'success' : ''"
            @click="
              enableEditDescription ? updateNiveauDescription() : (enableEditDescription = true)
            "
          ></v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :items="refNiveau.apprentissage_critique" :headers="headers" hide-default-footer>
        <template v-slot:body>
          <tr
            v-for="(n, index) in nLines"
            style="padding-top: 10px; padding-bottom: 10px"
            :key="n"
            :class="{ dragging: isDragging && draggedItemIndex === n }"
            draggable="true"
            @dragstart="onDragStart($event, n)"
            @dragover.prevent
            @drop="onDrop($event, n)"
          >
            <td v-if="editingItem.status && editingItem.index === index">
              <v-text-field
                variant="outlined"
                density="compact"
                v-model="getApprByOrdre(n).libelle"
                @blur="saveItem(index)"
              ></v-text-field>
            </td>
            <td v-if="(!editingItem.status || editingItem.index !== index) && getApprByOrdre(n)">
              {{ getApprByOrdre(n).libelle }}
            </td>
            <td v-if="getApprByOrdre(n)" width="128px">
              <v-btn
                v-if="editingItem.status && editingItem.index === index"
                icon="mdi-check"
                size="x-small"
                @click="saveItem(index)"
              ></v-btn>
              <v-btn v-else icon="mdi-pencil" size="x-small" @click="editItem(index)"></v-btn>
              <v-btn icon="mdi-arrow-all" size="x-small" style="margin-left: 0px"></v-btn>
              <v-btn
                color=""
                icon="mdi-delete"
                size="x-small"
                style="margin-left: 0px"
                @click="deleteItem(n)"
              ></v-btn>
            </td>
            <td v-if="!getApprByOrdre(n)"></td>
            <td v-if="!getApprByOrdre(n)"></td>
          </tr>
        </template>
      </v-data-table>
      <v-row>
        <v-col style="text-align: center">
          <v-text-field
            class="mt-1"
            v-model="apprentissageLibelleToAdd"
            variant="outlined"
            density="compact"
            @keyup.enter="addApprentissage"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn icon="mdi-plus" color="success" @click="addApprentissage"> </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, defineProps, nextTick, watch, onMounted, onBeforeMount } from 'vue'
import { useApprentissageStore } from '@/stores/apprentissageStore'
const apprentissageStore = useApprentissageStore();

const headers = ref([
  { text: 'Nom', value: 'name' },
  { text: 'Actions', value: 'actions', sortable: false }
])
const descriptionRef = ref(null)
const emit = defineEmits(['fetchCompetence', 'setHeight', 'nLinesHandler'])
const props = defineProps({
  niveau: Object,
  nLines: Number,
  valueToHave: Number,
  setHeight: Function,
  nLinesHandler: Function
})

const refNiveau = ref(null)
const init = async () => {
  await apprentissageStore.fetchNiveauById( props.niveau.id ).then(d => {
    refNiveau.value = d;
  })
}
onBeforeMount( async () => {
  await init()
});

const enableEditLibelle = ref(false)
const updateNiveauLibelle = async () => {
  if( refNiveau.value === null ) {
    return
  }
  enableEditLibelle.value = false
    computeHeight()
    await apprentissageStore.updateNiveau(refNiveau.value)
    refNiveau.value = await apprentissageStore.fetchNiveauById( refNiveau.value.id ) 

}


const heightPreference = ref(props.valueToHave)
watch(
  () => props.valueToHave,
  async (newVal) => {
    heightPreference.value = newVal
  },
  { immediate: true, deep: true }
)

const enableEditDescription = ref(false)
const apprentissageLibelleToAdd = ref('')
const editingItem = ref({
  index: null,
  status: false
})

const draggedItemIndex = ref(null)
const isDragging = ref(false)

const getApprByOrdre = (ordre) => {
  return refNiveau.value.apprentissage_critique.find((a) => a.ordre === ordre)
}

const getNextOrdre = () => {
  let max = 0
  refNiveau.value.apprentissage_critique.forEach((a) => {
    max = a.ordre > max ? a.ordre : max
  })
  return max + 1
}

const computeHeight = async () => {
  await nextTick()

  const element = descriptionRef.value
  if( descriptionRef.value ) {
    const height = element.getBoundingClientRect().height
    emit('setHeight', height + 20) // Ajustez ou retirez "+ 20" si nécessaire
  }
}

const updateNiveauDescription = async () => {
  if( refNiveau.value === null ) {
    return
  }
  enableEditDescription.value = false
  await computeHeight()
  await apprentissageStore.updateNiveau(refNiveau.value)
  refNiveau.value = await apprentissageStore.fetchNiveauById( refNiveau.value.id ) 

}
onMounted( () => {
  updateNiveauDescription();
});

const addApprentissage = async () => {
  await apprentissageStore.createApprentissage(
    apprentissageLibelleToAdd.value,
    getNextOrdre(),
    refNiveau.value.id
  )
  apprentissageLibelleToAdd.value = ''
  refNiveau.value = await apprentissageStore.fetchNiveauById( refNiveau.value.id )
  emit('nLinesHandler')
}

const onDragStart = (event, index) => {
  draggedItemIndex.value = index
  isDragging.value = true
}

const onDrop = (event, dropIndex) => {
  const draggedIndex = draggedItemIndex.value

  if (draggedIndex !== null && draggedIndex !== dropIndex) {
    const draggedItem = refNiveau.value.apprentissage_critique.find((a) => a.ordre === draggedIndex)
    const dropItem = refNiveau.value.apprentissage_critique.find((a) => a.ordre === dropIndex)
    draggedItem.ordre = dropIndex

    if (dropItem) {
      dropItem.ordre = draggedIndex
    }

    updateOrdre(draggedItem, dropItem)
  }

  draggedItemIndex.value = null
  isDragging.value = false
}

const updateOrdre = async (item1, item2) => {
  await apprentissageStore.updateApprentissage(item1)
  if (item2) {
    await apprentissageStore.updateApprentissage(item2)
  }
  refNiveau.value = await apprentissageStore.fetchNiveauById( refNiveau.value.id ) 
  // emit('fetchCompetence')
}

const editItem = (index) => {
  editingItem.value.status = true
  editingItem.value.index = index
}

const saveItem = async (index) => {
  const item = refNiveau.value.apprentissage_critique[index]
  // Logic to save the edited item
  await apprentissageStore.updateApprentissage(item).then(() => {
    editingItem.value.status = false
    editingItem.value.index = null
  })
  refNiveau.value = await apprentissageStore.fetchNiveauById( refNiveau.value.id ) 

}

const deleteItem = async (ordre) => {
  const item = getApprByOrdre(ordre)
  await apprentissageStore.deleteApprentissage(item).then(() => {
  })
  refNiveau.value = await apprentissageStore.fetchNiveauById( refNiveau.value.id ) 

}

watch(
  () => apprentissageStore.apprentissages,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      refNiveau.value = await apprentissageStore.fetchNiveauById(refNiveau.value.id);
      emit('nLinesHandler');
    }
  },
  { deep: true }
);

</script>

<style scoped>
.description-text {
  word-wrap: break-word; /* Ensures long words break to the next line */
  white-space: pre-wrap; /* Preserves whitespace and wraps text */
}
</style>