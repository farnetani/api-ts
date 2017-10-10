import { ScriptModel } from './script.model'
import { AppModel } from './../app/app.model'
import { UsuarioModel } from './../usuario/usuario.model'

export class Script {
  model:  ScriptModel

  constructor (){
    this.model = new ScriptModel()
    //Scripts para rodar
    this.insertAppPrincipal()
    this.insertUsuarioPrincipal()
  }

  private ScriptPronto (nome, type, json){
    const script = {
      nome,
      pronto: true,
      result: { type, json }
    }
    this.model.create(script, () => {})
  }

  insertAppPrincipal (){
    const nome = 'insertAppPrincipal'
    this.model.findNome(nome, (err, item) => {
      if(!item || !item.pronto) {
        const model = new AppModel()
        const app = { nome: 'App Web', senha: 'Sec!AppWeb@0129' }
        model.create(app, (err, insert) => {
          if(!err && insert) {
            this.ScriptPronto(nome, 'finalizado', insert)
          }
        })
      }
    })
  }
  
  insertUsuarioPrincipal (){
    const nome = 'insertUsuarioPrincipal'
    this.model.findNome(nome, (err, item) => {
      if(!item || !item.pronto) {
        const model = new UsuarioModel()
        const usuario = { nome: 'Demo User', email: 'demo@gmail.com', senha: 'demo.123' }
        model.create(usuario, (err, insert) => {
          if(!err && insert) {
            this.ScriptPronto(nome, 'finalizado', insert)
          }
        })
      }
    })
  }

  

}