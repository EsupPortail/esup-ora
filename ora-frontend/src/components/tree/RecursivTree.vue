  <template>
  <!-- Racine -->
  <v-container style="padding-top: 12px; padding-left: 12px; background-color: white">
    <template v-if="root">
      <div
        @click="
          () => {
            const idx = expanded.indexOf('root')
            if (idx !== -1) {
              expanded.splice(idx, 1)
            } else {
              expanded.push('root')
            }
          }
        "
      >
        <v-icon style="position: relative; top: 16px; left: -11px; cursor: pointer">
          {{ expanded.includes('root') ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
        </v-icon>
      </div>
      <template>
        <transition name="expand-fade">
          <v-list
            v-show="expanded.includes('root')"
            density="compact"
            nav
            append-icon=""
            style="
              padding-top: 10px !important;
              padding-left: 10px;
              border-left: 2px solid #ccc;
              top: 10px;
              position: relative;
            "
          >
            <RecursivTree :items="itemsRef" :root="false" :expanded="expanded" />
          </v-list>
        </transition>
      </template>
    </template>

    <!-- Affichage récursif -->
    <template v-else>
      <div v-for="(item, idx) in itemsRef" :key="item.name + idx">
        <!-- Si l'item a des enfants -->
        <v-list-group
          v-if="item.children && item.children.length"
          :value="item.name"
          v-model:opened="expanded"
          class="tree-group tree-node tree-node--group"
          append-icon=""
        >
          <template #append />
          <template #activator="{ props }">
            <v-list-item
              style="padding-left: 0 !important"
              v-bind="props"
              @click.stop="
                () => {
                  const idx = expanded.indexOf(item.name)
                  if (idx !== -1) {
                    expanded.splice(idx, 1)
                  } else {
                    expanded.push(item.name)
                  }
                }
              "
            >
              <template #prepend>
                <v-icon size="small">
                  {{ expanded.includes(item.name) ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                </v-icon>
              </template>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </template>

          <!-- Appel récursif sur enfants -->
          <div class="tree-children">
            <RecursivTree :items="item.children" :root="false" :expanded="expanded" />
          </div>
        </v-list-group>

        <!-- Sinon, c'est une feuille -->
        <v-list-item v-else class="tree-node tree-node--leaf">
          <template #prepend>
            <v-icon>mdi-book-open-outline</v-icon>
          </template>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </div>
    </template>
  </v-container>
</template>

<script setup>
import { ref, defineProps, watchEffect } from 'vue'
import RecursivTree from '@/components/tree/RecursivTree.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  root: {
    type: Boolean,
    default: false
  },
  expanded: {
    type: Array,
    default: () => []
  }
})

const itemsRef = ref(props.items)
const expanded = props.root ? ref([]) : props.expanded

// 🧠 Fonction pour collecter les noms à ouvrir
const collectGroupNames = (items) => {
  const names = []
  for (const item of items) {
    if (item.children?.length) {
      names.push(item.name)
      names.push(...collectGroupNames(item.children))
    }
  }
  return names
}

// 🔁 Initialisation automatique à la racine
if (props.root) {
  watchEffect(() => {
    expanded.value = collectGroupNames(itemsRef.value)
  })
}
</script>

<style scoped>
.tree-children {
  position: relative;
  margin-left: 0px; /* réduit l'indentation */
  padding-left: 16px;
  border-left: 2px solid #ccc; /* ligne verticale */
}

.tree-node {
  position: relative;
}

.tree-node--leaf {
  position: relative;
}

.tree-node--leaf::before {
  content: '';
  position: absolute;
  top: 10px;
  left: -18px;
  width: 16px;
  height: 2px;
  background-color: #ccc;
  transform: translateY(-50%);
}

.tree-node--group::before {
  content: '';
  position: absolute;
  top: -12px; /* ou ajuste selon le padding du groupe */
  left: -18px;
  width: 28px;
  height: 2px;
  background-color: #ccc;
}
.tree-node::before {
  content: '';
  position: absolute;
  top: -12px;
  left: -30px;
  width: 28px;
  height: 2px;
  background-color: #ccc;
  transform: translateY(-50%); /* centré verticalement */
}
.v-icon {
  margin-right: 6px;
  min-width: 20px; /* empêche les décalages d’icône */
}

.v-list-item {
  padding-left: 0 !important;
  position: relative;
  top: -31px;
}

.v-list-item.tree-node--leaf {
  top: -50px;
}
</style>
