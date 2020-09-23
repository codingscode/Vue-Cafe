<template>
  <div>
    <h1 class="title">Criação de conta</h1>

    <h2 class="subtitle">Crie uma conta ou faça login para solicitar sua assinatura de CoffeeBox</h2>

    <form v-if="!loggedIn" class="form">
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input type="text" v-model="$v.form.email.$model" :disabled="emailCheckedInDB" placeholder="seu@email.com" class="form-control"
               id="email" />
        <div v-if="emailCheckedInDB" class="error info">
          <a href="#" @click="reset">Não é você?</a>
        </div>
        <div v-if="$v.form.email.$error && !$v.form.email.required" class="error" >O email é obrigatório</div>
        <div v-if="$v.form.email.$error && !$v.form.email.email" class="error">O email é inválido</div>
      </div>

      <div v-if="emailCheckedInDB" class="form-group">
          <label class="form-label" for="senha">Senha</label>
          <input v-model="$v.form.senha.$model" type="senha" placeholder="Senha super secreta" class="form-control" id="senha" />
          <div v-if="$v.form.senha.$error && !$v.form.senha.required" class="error" >
              A senha é obrigatório
          </div>
          <div v-if="$v.form.senha.$error && !$v.form.senha.correct" class="error" >
            Senha inválida tente novamente
          </div>
      </div>

      <div v-if="emailCheckedInDB && !existingUser" class="form-group">
        <label class="form-label" for="name">Nome</label>
        <input v-model="$v.form.name.$model" type="text" placeholder="Como gosta de ser chamado?" class="form-control" id="name" />
        <div v-if="$v.form.name.$error" class="error">O nome é obrigatório</div>
      </div>
    </form>
    <div v-else class="text-center">
          Logado com sucesso!
          <a href="#" @click="reset">Não é {{form.name}}?</a>
    </div>
  </div>
</template>

<script>

import { autenticarUsuario, verUsuarioPresentenoDB } from "../api/index";
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
      return {
        form: { email: null, senha: null, name: null },
        emailCheckedInDB: false,
        existingUser: false,
        wrongPassword: false
      };
  },
  computed: {
    loggedIn() {
        return this.existingUser && this.form.name;
    }
  },
  validations: {
    form: {
        email: { required, email },
        senha: {
            required,
            correct() {
              return !this.wrongPassword;
            }
        },
        name: { required }
    }
  },
  methods: {
        checkIfUserExists() {
          if (!this.$v.form.email.$invalid) {
              this.$emit("updateAsyncState", "pending");
              return verUsuarioPresentenoDB(this.form.email)
                .then(() => {
                  // User exists
                  this.existingUser = true;
                  this.emailCheckedInDB = true;
                  this.$emit("updateAsyncState", "success");
                })
                .catch(() => {
                  // User  doesn't exist
                  this.existingUser = false;
                  this.emailCheckedInDB = true;
                  this.$emit("updateAsyncState", "success");
                });
          }
          else {
            return Promise.reject("email is invalid");
          }
        },

        login() {
          this.wrongPassword = false;
          if (!this.$v.form.senha.$invalid) {
            this.$emit("updateAsyncState", "pending");
            return autenticarUsuario(this.form.email, this.form.senha)
              .then(usuario => {
                this.form.name = usuario.name;
                this.$emit("updateAsyncState", "success");
              })
              .catch(() => {
                this.wrongPassword = true;
                this.$emit("updateAsyncState", "success");
              });
          } else {
            return Promise.reject("senha is invalid");
          }
        },

        reset() {
          this.form.email = null;
          this.form.senha = null;
          this.form.name = null;
          this.emailCheckedInDB = false;
          this.wrongPassword = false;
          this.existingUser = false;
          this.$v.$reset();
        },

        submit() {
          let job;
          if (!this.emailCheckedInDB) {
            this.$v.form.email.$touch();
            job = this.checkIfUserExists();
          }
          else {
            if (this.existingUser && !this.loggedIn) {
              this.$v.form.senha.$touch();
              job = this.login();
            }
            else {
              this.$v.$touch();
              job = Promise.resolve();
            }
          }

          return new Promise((resolve, reject) => {
                job.then(() => {
                  if (!this.$v.$invalid) {
                    resolve({
                      email: this.form.email,
                      senha: this.form.senha,
                      name: this.form.name
                    });
                  } else {
                    reject("data is not valid yet");
                  }
                })
                .catch(error => reject(error));
          });

          // this.$emit("update", {
          //   data: {
          //     email: this.form.email,
          //     senha: this.form.senha,
          //     name: this.form.name
          //   },
          //   valid: !this.$v.$invalid
          // });
    }
  }
}

</script>

<style scoped>

</style>