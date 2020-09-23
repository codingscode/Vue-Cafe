<template>
  <div>
        <div v-if="wizardInProgress" v-show="asyncState !== 'pending'">
            <keep-alive>
                <component ref="importAtual" :is="importAtual" @updateAsyncState="updateAsyncState" :wizardData="form" ></component>
            </keep-alive>
            <div class="progress-bar">
                <div :style="`width: ${progresso}%;`"></div>
            </div>

            <!-- Actions -->
            <div class="buttons">
                <button @click="goBack" v-if="numeroImportAtual > 1" class="btn-outlined">Voltar</button>
                <button @click="botaoProximaAcao" class="btn" >
                  {{ eUltimoImport ? 'Completar Pedido' : 'Avançar' }}
                </button>
            </div>
        </div>
    <div v-else>
        <h1 class="title">Obrigado!</h1>
        <h2 class="subtitle">Estamos ansiosos para enviar sua primeira caixa!</h2>

        <p class="text-center">
           <a href="#" target="_blank" class="btn">Vá a algum lugar legal</a>
        </p>
    </div>
    <div class="loading-wrapper" v-if="asyncState === 'pending'">
        <div class="loader">
            <img src="/spinner.svg" alt />
            <p>Porfavor aguarde...</p>
        </div>
    </div>
  </div>
</template>

<script>
import { postFormParaDB } from "../api/index";
import FormPlanPicker from "./FormPlanPicker";
import FormUserDetails from "./FormUserDetails";
import FormAddress from "./FormAddress";
import FormReviewOrder from "./FormReviewOrder";

export default {
  name: "FormWizard",
  components: { FormPlanPicker, FormUserDetails, FormAddress, FormReviewOrder },
  data() {
        return {
            numeroImportAtual: 1, 
            asyncState: null,
            imports: [ "FormPlanPicker", "FormUserDetails", "FormAddress", "FormReviewOrder" ],
            form: { plano: null, email: null, nome: null, senha: null, endereco: null, recipient: null, chocolate: false, outroTratamento: false }
        };
  },
  computed: {
      eUltimoImport() {  // é-ultimo-import
          return this.numeroImportAtual === this.comprimento
      },
      wizardInProgress() {
          return this.numeroImportAtual <= this.comprimento
      },
      importAtual() {
          return this.imports[this.numeroImportAtual - 1]
      },
      comprimento() {
          return this.imports.length
      },
      progresso() {
          return (this.numeroImportAtual / this.comprimento) * 100
      }
  },
  methods: {
        updateAsyncState(state) {
            this.asyncState = state
        },
        submitOrder() {
            this.asyncState = "pending";
            postFormParaDB(this.form).then(() => {
                console.log("ok");
                this.numeroImportAtual++;
                this.asyncState = "success";
            });
        },
        botaoProximaAcao() {
            this.$refs.importAtual
              .submit()
              .then(stepData => {
                  Object.assign(this.form, stepData);
                  if (this.eUltimoImport) {
                    this.submitOrder();
                  }
                  else {
                    this.goNext();
                  }
              })
              .catch(error => console.log(error))
        },
        goBack() {
            this.numeroImportAtual--
        },
        goNext() {
            this.numeroImportAtual++
        }
  }
};
</script>
