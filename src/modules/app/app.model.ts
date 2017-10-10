import * as bcrypt from 'bcrypt-nodejs'
import { Model } from './../../template/simple/model'
import { CrudModel } from './../../template/crud/model'

export class AppModel extends Model implements CrudModel{
  constructor() {
    const fields = {
      key: {type: String, required: true},
      nome: {type: String, required: true},
      senha: {type: String, required: true}
    }
    const indexes = { nome: 1 }
    const methods = ['compareHash']
    super({ name: 'App', fields, indexes, methods })
  }

  //Compara a senha
  protected compareHash (senha: String, cb: Function) {
    bcrypt.compare(senha, this.senha, function(err, isMatch){
      if (err) return cb(err, null)
      cb(null, isMatch)
    })
  }

  //Update dados senha
  private hashSenha (senha, cb) {
    bcrypt.hash(senha, null, null, (err, hash) => {
      if(err) return cb(err)
      return cb(null, hash)
    })
  }
  
  //Update dados senha
  private hashKey (nome, cb) {
    bcrypt.hash(nome, null, null, (err, hash) => {
      if(err) return cb(err)
      return cb(null, hash)
    })
  }

  find (query: any, cb: Function) {
    super.find({ nome:1 }, query, { nome: 1 }, cb)
  }

  //Verifica se é unico
  uniqueValid (dados, cb) {
    const params = { nome: dados.nome }
    super.uniqueValid(dados, params, cb)
  }

  //Cria um novo app
  create (dados, cb) {
    this.hashSenha(dados.senha, (err, hash) => {
      if(err) return cb(err)
      dados.senha = hash
      this.hashKey(dados.nome, (err, hashKey) => {
        if(err) return cb(err)
        dados.key = hashKey
        super.create(dados, cb)
      })
    })
  }

  //Edita app
  update (_id, dados, cb) {
    if(dados.key) {
      dados.key = undefined
      delete dados.key 
    }
    if(dados.senha) {
      this.hashSenha(dados.senha, (err, hash) => {
        if(err) return cb(err)
        dados.senha = hash
        super.update(_id, dados, cb)
      })
    }else{
      super.update(_id, dados, cb)
    }
  }

  verificaApp(key, cb) {
    this.findOne({ key, ativo:true }, ['_id'], cb)
  }

  verificaSenhaApp(_id, senha, cb) {
    this.findOne({ _id, ativo:true }, ['senha'], (err, app) => {
      app.compareHash(senha, (err, isMatch) => {
        if (err || !isMatch) return cb({ message: 'Senha incorreta!'})

        return cb(null, app)
      })
    })
  }
}