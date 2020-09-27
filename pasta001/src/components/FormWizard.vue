<template>
  <div>
        <div v-if="wizardInProgress" v-show="estadoAsync !== 'pending'">
            <keep-alive>
                <component ref="importAtual" :is="importAtual" @atualizarEstadoAsync="atualizarEstadoAsync" :wizardData="form" ></component>
            </keep-alive>
            <div class="progress-bar">
                <div :style="`width: ${progresso}%;`"></div>
            </div>

            <!-- Actions -->
            <div class="buttons">
                <button @click="voltar" v-if="numeroImportAtual > 1" class="btn-outlined">Voltar</button>
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
    <div class="loading-wrapper" v-if="estadoAsync === 'pending'">
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
            estadoAsync: null,
            imports: [ "FormPlanPicker", "FormUserDetails", "FormAddress", "FormReviewOrder" ],
            form: { plano: null, email: null, nome: null, senha: null, endereco: null, recipiente: null, chocolate: false, outroTratamento: false }
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
        atualizarEstadoAsync(state) {
            this.estadoAsync = state
        },
        enviarPedido() {
            this.estadoAsync = "pending";
            postFormParaDB(this.form).then(() => {
                console.log("ok");
                this.numeroImportAtual++;
                this.estadoAsync = "success";
            });
        },
        botaoProximaAcao() {
            this.$refs.importAtual
              .enviar()
              .then(dadoEtapa => {
                  Object.assign(this.form, dadoEtapa);
                  if (this.eUltimoImport) {
                     this.enviarPedido();
                  }
                  else {
                     this.avancar();
                  }
              })
              .catch(erro => console.log(erro))
        },
        voltar() {
            this.numeroImportAtual--
        },
        avancar() {
            this.numeroImportAtual++
        }
  }
};
</script>
