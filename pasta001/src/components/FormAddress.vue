<template>
  <div>
    <h1 class="title">Detalhes da entrega</h1>

    <h2 class="subtitle">Para onde devemos enviar seus grãos de café recém-torrados?</h2>

    <form class="form">
      <div class="form-group">
          <label class="form-label" for="delivery_name">Nome</label>
          <input v-model="$v.form.recipient.$model" type="text" placeholder="Nome do destinatário" class="form-control" id="delivery_name" />
          <div v-if="$v.form.recipient.$error" class="error">Este campo é obrigatório</div>
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
      form: { endereco: null, recipient: this.wizardData.nome }
    }
  },
  activated() {
    this.form.recipient = this.wizardData.nome;
  },
  validations: {
    form: { 
      endereco: { required },
      recipient: { required }
    }
  },
  methods: {
      submit() {
        this.$v.$touch()
        return new Promise((resolve, reject) => {
            if (!this.$v.$invalid) {
              resolve({
                endereco: this.form.endereco,
                recipient: this.form.recipient
              })
            }
            else {
              reject("invalid endereco")
            }
        })
      }
  }
}
</script>

<style scoped>

</style>