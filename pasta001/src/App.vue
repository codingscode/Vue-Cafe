<template>
  <div id="app" class="container mx-auto py-6">
      <header>
        <div>
          <span id="logo">Café da Serra</span>
        </div>
      </header>

      <div class="content">
         <FormAssistente />
      </div>
  </div>
</template>

<script>
import FormAssistente from './components/FormAssistente.vue'

export default {
      name: 'app',
      components: { FormAssistente }
}

</script>
