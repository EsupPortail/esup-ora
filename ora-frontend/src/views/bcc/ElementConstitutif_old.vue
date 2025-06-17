<template>
  <v-card
    style="
      margin-top: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);
    "
  >
    <v-card-title>
      <v-row align="center">
        <v-col cols="1">
          <span class="text-subtitle-1">
            EC{{ dataIDBCC }}-{{
              data.enseignement
                ? data.enseignement.id
                : data.sae
                ? data.sae.id
                : data.portfolio
                ? data.portfolio.id
                : 'No id'
            }}
          </span>
        </v-col>
        <v-col cols="7">
          <span class="text-subtitle-1">{{
            data.libelle
          }}</span>
        </v-col>
        <v-col cols="2">
          <span
            class="text-subtitle-2 rounded"
            style="
              background-color: purple-light;
              border: 1px solid purple-light;
              border-radius: 32px;
            "
            :class="{
              'purple--text': data.enseignement,
              'orange--text': data.sae,
              purple: data.enseignement
            }"
          >
            <b style="background-color: purple; color: white; border-radius: 16px; padding: 6px;">{{ typeEC }}</b>
          </span>
        </v-col>
        <v-col cols="2" class="text-right">
          <v-btn icon @click="isExpanded = !isExpanded">
            <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider style="margin-top: 10px"></v-divider>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-if="isExpanded">
        <v-row v-if="typeEC == 'Enseignement'">
          <v-spacer /> 
          <v-col cols="8">
            <v-row>
              <v-col cols="2" style="padding-top: 22px; padding-left: 0px; padding-right: 0px">
                <span style="font-size: 14px">Volume horaire</span>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  type="number"
                  label="TP"
                  v-model="ecData.volume_horaire_tp"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  type="number"
                  label="TD"
                  v-model="ecData.volume_horaire_td"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  type="number"
                  label="CM"
                  v-model="ecData.volume_horaire_cm"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row style="margin-top: 0px">
              <span style="padding-top: 12px"> Enseignement : </span>
              <v-radio-group inline>
                <v-radio label="Présentiel" value="one" :checked="ecData.est_presentiel"></v-radio>
                <v-radio label="Distanciel" value="2" :checked="ecData.est_distanciel"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row style="margin-top: 0px">
              <span style="padding-top: 12px"> Enseignement : </span>
              <v-radio-group inline>
                <v-radio label="Obligatoire" value="one" :checked="ecData.est_distanciel"></v-radio>
                <v-radio label="Optionnel" value="2" :checked="ecData.est_distanciel"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row style="margin-top: 0px">
              <span style="padding-top: 12px">
                Enseignement ouvert aux étudiants internationaux:
              </span>
              <v-radio-group inline>
                <v-radio label="Oui" :checked="ecData.est_ouvert_etudiants_internationaux" value="one"></v-radio>
                <v-radio label="Non" :checked="!ecData.est_distanciel" value="2"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row>
              <v-select
                variant="outlined"
                density="compact"
                :items="ecData.tags"
                persistent-hint
                hint="Sélectionnez des tags"
                multiple
              />
            </v-row>
            <v-row>
              <v-textarea
                style="margin-top: 20px"
                v-model="ecData.description"
                no-resize
                rows="3"
                label="Description"
              ></v-textarea>
            </v-row>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row v-else-if="data.sae !== undefined">
          <v-spacer />
          <v-col cols="8" style="margin-top: 12px;">
            <v-row>
              <v-row>
                <span style="font-weight: 600;">Volume horaire :</span>
              </v-row>
              <v-divider style="margin-top: 10px;" />
              <v-row style="margin-top: 10px;">
                <v-col cols="3" style="padding-top: 22px;">
                  <span style="font-size: 14px">Accompagnement :</span>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    type="number"
                    label="TP"
                    v-model="data.sae.accompagnement.tp"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    type="number"
                    label="TD"
                    v-model="data.sae.accompagnement.td"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    type="number"
                    label="PT"
                    v-model="data.sae.accompagnement.pt"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-row>
            <v-row style="margin-top: 0px;">
              <v-col cols="3" style="padding-left: 0px; padding-top: 22px; padding-bottom: 0px;">
                <span>Travail personnel :</span>
              </v-col>
              <v-col cols="3" style="padding-left: 6px;  padding-bottom: 0px;">
                <v-text-field
                  type="number"
                  variant="outlined"
                  label="TP"
                  density="compact"
                  v-model="data.sae.travailPersonnel"
                  inline
                ></v-text-field>
              </v-col>
              <v-divider />
            </v-row>
            <v-row style="margin-top: 24px;">
              <v-textarea v-model="data.sae.description" variant="outlined" rows="4" label="Description"></v-textarea>
            </v-row>
            <v-row style="margin-top: 0px;">
                <v-col cols="2" style="padding-top: 22px; padding-left: 0px; padding-right: 0px;">
                  <span style="font-size: 13px">Groupe étudiants:</span>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    type="number"
                    label="minimum"
                    v-model="data.sae.nbEtudiantMin"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    type="number"
                    label="maximum"
                    v-model="data.sae.nbEtudiantMax"
                  ></v-text-field>
                  </v-col>
                  </v-row>
            <v-row style="margin-top: 6px;">
              <v-textarea v-model="data.sae.description" variant="outlined" rows="4" label="Commentaire"></v-textarea>
            </v-row>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row v-else-if="data.portfolio !== undefined"> </v-row>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue'
const {useEcStore} = '@/stores/elementConstitutifStore'

const props = defineProps({
  ec: Object,
  idBCC: Number,
  typeEC: String
})
const isExpanded = ref(false)
const dataIDBCC = computed(() => props.idBCC)
const ecData = ref({ ...props.ec })
const ecStore = useEcStore();


</script>
