<template>
  <div>
    <h1 class="title">Detalhes da entrega</h1>

    <h2 class="subtitle">Para onde devemos enviar seus grãos de café recém-torrados?</h2>

    <form class="form">
      <div class="form-group">
          <label class="form-label" for="delivery_name">Nome</label>
          <input v-model="$v.form.recipiente.$model" type="text" placeholder="Nome do destinatário" class="form-control" id="delivery_name" />
          <div v-if="$v.form.recipiente.$error" class="error">Este campo é obrigatório</div>
      </div>

      <div class="form-group">
          <label class="form-label" for="endereco">Endereço</label>
          <textarea v-model="$v.form.endereco.$model" placeholder="Rua da Estrela, Bairro do Centro - Santa Maria - SP" rows="3"
              class="form-control" id="endereco">
          </textarea>
          <div v-if="$v.form.endereco.$error" class="error">Este campo é obrigatório</div>
      </div>
    </form>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
      props: { wizardData: { type: Object, required: true } },
      data() {
          return {
             form: { endereco: null, recipiente: this.wizardData.nome }
          }
      },
      activated() {
          this.form.recipiente = this.wizardData.nome;
      },
      validations: {
          form: { endereco: { required }, recipiente: { required } }
      },
      methods: {
          enviar() {
              this.$v.$touch()
              return new Promise((resolve, reject) => {
                  if (!this.$v.$invalid) {
                      resolve({ endereco: this.form.endereco, recipiente: this.form.recipiente })
                  }
                  else {
                      reject("Endereço Inválido")
                  }
              })
          }
      }
}
</script>

<style scoped>

</style>