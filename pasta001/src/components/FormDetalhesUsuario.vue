<template>
  <div>
    <h1 class="title">Criação de conta</h1>

    <h2 class="subtitle">Crie uma conta ou faça login para solicitar sua assinatura de CoffeeBox</h2>

    <form v-if="!logado" class="form">
            <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input type="text" v-model="$v.form.email.$model" :disabled="emailChecadoNoDB" placeholder="seu@email.com" class="form-control"
                    id="email" />
                <div v-if="emailChecadoNoDB" class="error info">
                <a href="#" @click="re_setar">Não é você?</a>
                </div>
                <div v-if="$v.form.email.$error && !$v.form.email.required" class="error" >O email é obrigatório</div>
                <div v-if="$v.form.email.$error && !$v.form.email.email" class="error">O email é inválido</div>
            </div>

            <div v-if="emailChecadoNoDB" class="form-group">
                <label class="form-label" for="senha">Senha</label>
                <input v-model="$v.form.senha.$model" type="senha" placeholder="Senha super secreta" class="form-control" id="senha" />
                <div v-if="$v.form.senha.$error && !$v.form.senha.required" class="error" >
                    A senha é obrigatória
                </div>
                <div v-if="$v.form.senha.$error && !$v.form.senha.correct" class="error" >
                    Senha inválida tente novamente
                </div>
            </div>

            <div v-if="emailChecadoNoDB && !usuarioExistente" class="form-group">
                <label class="form-label" for="nome">Nome</label>
                <input v-model="$v.form.nome.$model" type="text" placeholder="Como gosta de ser chamado?" class="form-control" id="nome" />
                <div v-if="$v.form.nome.$error" class="error">O nome é obrigatório</div>
            </div>
    </form>
    <div v-else class="text-center">
          Logado com sucesso!
          <a href="#" @click="re_setar">Não é {{form.nome}}?</a>
    </div>
  </div>
</template>

<script>

import { autenticarUsuario, verUsuarioPresentenoDB } from '../api/index'
import { required, email } from 'vuelidate/lib/validators'

export default {
    data() {
        return {
            form: { email: null, senha: null, nome: null },
            emailChecadoNoDB: false,
            usuarioExistente: false,
            senhaErrada: false
        }
    },
    computed: {
        logado() {
            return this.usuarioExistente && this.form.nome
        }
    },
    validations: {
        form: {
            email: { required, email },
            senha: { required,
                     correct() {
                        return !this.senhaErrada
                     }
            },
            nome: { required }
        }
    },
    methods: {
            ChecarSeUsuarioExiste() {
                if (!this.$v.form.email.$invalid) {
                    this.$emit('atualizarEstadoAsync', 'pendente')
                    return verUsuarioPresentenoDB(this.form.email)
                    .then(() => {
                        // Usuári Existe
                        this.usuarioExistente = true
                        this.emailChecadoNoDB = true
                        this.$emit('atualizarEstadoAsync', 'sucesso')
                    })
                    .catch(() => {
                        // Usuário não existe
                        this.usuarioExistente = false
                        this.emailChecadoNoDB = true
                        this.$emit('atualizarEstadoAsync', 'sucesso')
                    })
                }
                else {
                    return Promise.reject('email é inválido')
                }
            },

            login() {
                this.senhaErrada = false
                if (!this.$v.form.senha.$invalid) {
                    this.$emit('atualizarEstadoAsync', 'pendente')
                    return autenticarUsuario(this.form.email, this.form.senha)
                        .then(usuario => {
                            this.form.nome = usuario.nome
                            this.$emit('atualizarEstadoAsync', 'sucesso')
                        })
                        .catch(() => {
                            this.senhaErrada = true
                            this.$emit('atualizarEstadoAsync', 'sucesso')
                        })
                }
                else {
                    return Promise.reject('senha é inválida')
                }
            },

            re_setar() {
                this.form.email = null
                this.form.senha = null
                this.form.nome = null
                this.emailChecadoNoDB = false
                this.senhaErrada = false
                this.usuarioExistente = false
                this.$v.$re_setar()
            },

            enviar() {
                let trabalho
                if (!this.emailChecadoNoDB) {
                    this.$v.form.email.$touch()
                    trabalho = this.ChecarSeUsuarioExiste()
                }
                else {
                    if (this.usuarioExistente && !this.logado) {
                        this.$v.form.senha.$touch()
                        trabalho = this.login()
                    }
                    else {
                        this.$v.$touch()
                        trabalho = Promise.resolve()
                    }
                }

                return new Promise((resolve, reject) => {
                    trabalho.then(() => {
                        if (!this.$v.$invalid) {
                            resolve({ email: this.form.email, senha: this.form.senha, nome: this.form.nome })
                        }
                        else {
                            reject('Dado não é válido ainda')
                        }
                    })
                    .catch(erro => reject(erro))
                })

            // this.$emit("update", {
            //   data: {
            //     email: this.form.email,
            //     senha: this.form.senha,
            //     nome: this.form.nome
            //   },
            //   valid: !this.$v.$invalid
            // });
        }
    }
}

</script>

<style scoped>

</style>