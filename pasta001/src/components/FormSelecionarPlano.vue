<template>
    <div>
        <h1 class="title">Planos CoffeeBox</h1>

        <h2 class="subtitle">O mais genuino café, para amantes do verdadeiro sabor</h2>

        <div class="plans">
              <div v-for="plano in planos" :key="plano.preco" @click="escolherPlano(plano)" :class="{ 'active-plan': planoSelecionado === plano }"
                    class="plan" >
                  <div class="weight">{{ plano.massa }}</div>
                  <div class="description">
                      <span class="title">{{ plano.nome }}</span>
                      <span class="description">{{ plano.descricao }}</span>
                  </div>
                  <div class="price">
                      <span class="dollar-sign">R$</span>
                      <span class="number">{{ plano.preco }}</span>
                  </div>
              </div>
        </div>
        <div v-if="$v.planoSelecionado.$error" class="error">escolha um plano para continuar</div>
    </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
      data() {
            return {
              planos: [
                    { preco: 19, massa: '250g', nome: 'Básico', descricao: 'Um saco de grãos de café torrados na hora entregues em sua casa todos os meses' },
                    { preco: 29, massa: '500g', nome: 'Curioso', descricao: 'Dois tipos diferentes de café recém-torrado todos os meses' },
                    { preco: 49, massa: '1kg', nome: 'Viciado', descricao: 'Dois sacos de dois tipos diferentes de café recém-torrado todos os meses.' }
              ],
              planoSelecionado: null
            }
      },
      validations: { planoSelecionado: { required } },
      methods: {
            escolherPlano(plano) {
               this.planoSelecionado = plano
            },
            enviar() {
                this.$v.$touch()
                return new Promise((resolve, reject) => {
                    if (!this.$v.$invalid) {
                      resolve({ plano: this.planoSelecionado })
                    }
                    else {
                      reject('Plano não selecionado')
                    }
                })
            }
      }
}
</script>
