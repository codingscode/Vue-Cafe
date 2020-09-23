const usuario = { email: 'contato.frankrocha@gmail.com', senha: '123456', nome: 'Frank Rocha' }

export const verUsuarioPresentenoDB = email => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === usuario.email) {
            resolve(true)
          }
          else {
            reject('usuário não encontrado')
          }
        }, 1000)
      })
}

export const autenticarUsuario = (email, senha) => {
      return new Promise((resolve, reject) => {
            console.log(email === usuario.email && senha === usuario.senha)
            setTimeout(() => {
                  if (email === usuario.email && senha === usuario.senha) {
                      resolve({
                        email: usuario.email,
                        nome: usuario.nome
                      })
                  }
                  else {
                      reject('Essas credenciais não pertencem a nenhum usuário')
                  }
            }, 1000)
      })
}

export const postFormParaDB = form => {
    return new Promise(resolve => {
        setTimeout(() => resolve(form), 1000)
    })
}
