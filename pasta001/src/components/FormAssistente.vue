<template>
  <div>
       <div v-if="progressoAssistente" v-show="estadoAsync !== 'pendente'">
            <keep-alive>
                <component ref="importAtual" :is="importAtual" @atualizarEstadoAsync="atualizarEstadoAsync" :dadosAssistente="form" ></component>
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
    <div class="loading-wrapper" v-if="estadoAsync === 'pendente'">
        <div class="loader">
            <img src="/spinner.svg" alt />
            <p>Por favor aguarde...</p>
        </div>
    </div>
  </div>
</template>

<script>
import { postFormParaDB } from '../api/index'
import FormSelecionarPlano from './FormSelecionarPlano'
import FormDetalhesUsuario from './FormDetalhesUsuario'
import FormEndereco from './FormEndereco'
import FormRevisarPedido from './FormRevisarPedido'

export default {
  name: 'FormWizard',
  components: { FormSelecionarPlano, FormDetalhesUsuario, FormEndereco, FormRevisarPedido },
  data() {
        return {
            numeroImportAtual: 1, 
            estadoAsync: null,
            imports: [ 'FormSelecionarPlano', 'FormDetalhesUsuario', 'FormEndereco', 'FormRevisarPedido' ],
            form: { plano: null, email: null, nome: null, senha: null, endereco: null, recipiente: null, chocolate: false, outroTratamento: false }
        };
  },
  computed: {
      eUltimoImport() {  // é-ultimo-import
          return this.numeroImportAtual === this.comprimento
      },
      progressoAssistente() {
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
            this.estadoAsync = 'pendente'
            postFormParaDB(this.form).then(() => {
                console.log('ok')
                this.numeroImportAtual++
                this.estadoAsync = 'sucesso'
            })
        },
        botaoProximaAcao() {
            this.$refs.importAtual
              .enviar()
              .then(dadoEtapa => {
                  Object.assign(this.form, dadoEtapa)
                  if (this.eUltimoImport) {
                     this.enviarPedido()
                  }
                  else {
                     this.avancar()
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
}
</script>
