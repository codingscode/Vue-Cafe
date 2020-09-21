<template>
  <div>
    <h1 class="title">Confirme o seu pedido</h1>

    <h2 class="subtitle">Estamos quase lá!</h2>

    <div class="summary">
      <h3>Assinatura</h3>

      <p class="description">Enviaremos café cuidadosamente selecionado todos os meses.</p>

      <div class="plans">
        <div class="plan active-plan">
          <div class="weight">{{ wizardData.plano.weight }}</div>

          <div class="description">
            <span class="title">{{ wizardData.plano.name }}</span>
            <span class="description">{{ wizardData.plano.description }}</span>
          </div>

          <div class="price">
            <span class="dollar-sign">R$</span>
            <span class="number">{{totalPrice}}</span>
          </div>
        </div>
      </div>

      <h3>Suba de nível sua caixa</h3>

      <p class="description">Mime-se nivelando sua caixa mensal</p>

      <div class="options">
        <div class="option">
          <input v-model="form.chocolate" type="checkbox" value="chocolate" id="chocolate" />
          <label for="chocolate">4 pcs. Chocolate de Origem Única (+R$4,00/mês)</label>
        </div>

        <div class="option">
          <input v-model="form.otherTreat" type="checkbox" value="chocolate" id="other_treat" />
          <label for="other_treat">Outra delícia (+R$2,00/mês)</label>
        </div>
      </div>

      <div class="address">
        <div class="w-2/3">
          <h3>Entrega</h3>
          <p class="description">Sua primeira caixa de CoffeeBox está ao virar da esquina</p>
        </div>

        <div class="w-1/3">
          <h3>{{ wizardData.recipient }}</h3>
          <p class="leading-normal">{{ wizardData.address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
      props: { wizardData: { type: Object, required: true } },
      data() {
        return {
          form: { chocolate: false, otherTreat: false }
        };
      },
      computed: {
        totalPrice() {
            let total = this.wizardData.plano.price;
            if (this.form.chocolate) {
              total += 4;
            }
            if (this.form.otherTreat) {
              total += 2;
            }
            return total;
        }
      },
      validations: {},
      methods: {
          submit() {
              return Promise.resolve({ chocolate: this.form.chocolate, otherTreat: this.form.otherTreat });
          }
      }
};
</script>

<style scoped>

</style>