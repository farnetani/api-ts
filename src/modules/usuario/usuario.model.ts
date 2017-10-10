import * as bcrypt from 'bcrypt-nodejs'
import { Model } from './../../template/simple/model'
import { CrudModel } from './../../template/crud/model'

export class UsuarioModel extends Model implements CrudModel{
  constructor() {
    const fields = {
      nome: {type: String, required: true},
      email: {type: String, required: true, unique: true},
      senha: {type: String, required: true},
    }
    const indexes = { email: 1, nome: 1 }
    const methods = ['compareHash']
    super({ name: 'Usuario', fields, indexes, methods })
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

  find (query: any, cb: Function) {
    super.find({ nome:1, email: 1 }, query, { nome: 1 }, cb)
  }

  //Verifica se é unico
  uniqueValid (dados, cb) {
    const params = { email: dados.email }
    super.uniqueValid(dados, params, cb)
  }

  //Cria um novo usuário
  create (dados, cb) {
    this.hashSenha(dados.senha, (err, hash) => {
      if(err) return cb(err)
      dados.senha = hash
      super.create(dados, cb)
    })
  }

  //Edita usuário
  update (_id, dados, cb) {
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

  //Busca o usuário com login
  login (dados, cb) {
    this.findOne({ email: dados.email }, ['ativo', 'senha'], (err, usuario) => {
      if (err || !usuario) return cb({ message: 'Email não encontrado!' }) 
      if (!usuario.ativo) return cb({ message: 'Usuário inativo!' })
      
      usuario.compareHash(dados.senha, (err, isMatch) => {
        if (err || !isMatch) return cb({ message: 'Senha incorreta!'})

        return cb(null, usuario)
      })
    })
  }

}