<template>
  <div>
    <h1 class="title">Planos CoffeeBox</h1>

    <h2 class="subtitle">O mais genuino café, para amantes do verdadeiro sabor</h2>

    <div class="plans">
          <div v-for="plan in plans" :key="plan.price" @click="pickPlan(plan)" :class="{ 'active-plan': selectedPlan === plan }"
                class="plan" >
              <div class="weight">{{ plan.weight }}</div>
              <div class="description">
                <span class="title">{{ plan.name }}</span>
                <span class="description">{{ plan.description }}</span>
              </div>
              <div class="price">
                <span class="dollar-sign">R$</span>
                <span class="number">{{ plan.price }}</span>
              </div>
          </div>
    </div>
    <div v-if="$v.selectedPlan.$error" class="error">escolha um plano para continuar</div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
        return {
          plans: [
                { price: 19, weight: "250g", name: "Básico", description: "Um saco de grãos de café torrados na hora entregues em sua casa todos os meses" },
                { price: 29, weight: "500g", name: "Curioso", description: "Dois tipos diferentes de café recém-torrado todos os meses" },
                { price: 49, weight: "1kg", name: "Viciado", description: "Dois sacos de dois tipos diferentes de café recém-torrado todos os meses." }
          ],
          selectedPlan: null
        }
  },
  validations: { selectedPlan: { required } },
  methods: {
        pickPlan(plan) {
          this.selectedPlan = plan
        },
        submit() {
            this.$v.$touch()
            return new Promise((resolve, reject) => {
                if (!this.$v.$invalid) {
                  resolve({ plan: this.selectedPlan })
                }
                else {
                  reject("Plan Not Selected")
                }
            })
        }
  }
}
</script>
