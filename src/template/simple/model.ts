import { Schema, model } from 'mongoose'
import * as sanitize from 'mongo-sanitize'

export class Model {
  public name: String
  public entidade: Schema

  constructor({name, fields, indexes, methods}) {
    this.name = name
    this.constructSchema(fields)
    this.constructIndex(indexes)
    this.constructMethods(methods)
    this.constructEntidade()
  }

  //Construir Schema
  protected constructSchema(fields: any) {
    //Padrão de controle de toda aplicação
    fields.ativo = { type: Boolean, required: true, default: true }
    fields.criado_em = { type: Date, required: true, default: Date.now }
    fields.alterado_em = { type: Date }
    this.entidade = new Schema(fields)
  }

  //Constroi os indexes para otimização de pesquisa
  protected constructIndex(indexes: any) {
    indexes = Object.assign({ ativo: -1, criado_em: 1 }, indexes)
    this.entidade.index(indexes)
  }

  //Construir methods da entidade
  protected constructMethods(methods) {
    if (methods)
    methods.forEach(el => this.entidade.methods[methods] = this[methods])
  }

  //Construir entidade do mongoose
  protected constructEntidade() {
    try {
      this.entidade = model(this.name)
    } catch {
      this.entidade = model(this.name, this.entidade)
    }
  }

  //Functions que precisa de implementação
  //Retorna uma lista de registro de acordo com parametros
  protected find(select: any, query: any, sort: any, cb: Function, populate: any = false) {
    //Trata a pagina
    if (!query.page) query.page = 1
    if (!query.itensPorPagina) query.itensPorPagina = 10
    let limit = query.page * query.itensPorPagina
    let skip = limit - query.itensPorPagina

    //Trata select e sort
    select = Object.assign({ ativo: 1, criado_em: 1 }, select)
    sort = Object.assign({ ativo: -1 }, sort)
      
    //Executa a busca
    const busca = this.entidade.find(query.where).limit(limit).skip(skip).select(select).sort(sort)
    
    if (populate)
    for (let item of populate) 
      query.populate(item)

    busca.exec(cb)
  } 
  
  //Retorna um único registro
  protected findOne(filters: any, select: any = {}, cb: Function, populate: any = false) {
    let query = this.entidade.find(filters).select(select)
    if (populate)
      for (let item of populate) 
        query.populate(item)
    
    //Executa a busca
    query.exec((err, item) => {
      if (err || !item) return cb(err, item)
      return cb(err, item[0])
    })
  }

  //Verifica se é unico
  protected uniqueValid(dados, params: any, cb: Function) {
    this.entidade.findOne(params, function (err, item) {
      if (err) return cb(err)
      if (!(item == null || item._id == dados._id))
        return cb({ message: "Registro não é unico!" })

      return cb(null)
    })
  }

  //Retorna um único registro pelo ID
  getById(_id: String, select: any = {}, cb: Function, populate: any = false) {
    this.findOne({ _id: sanitize(_id) }, select, cb, populate)
  }

  //Public functions
  create (dados: any, cb: Function) {
    this.entidade.create(dados, cb)
  }
  
  //Altera um registro
  update(_id: String, dados: any, cb: Function) {
    dados.alterado = Date.now()
    dados.__v == undefined
    delete dados.__v
    const where: any = { _id: sanitize(_id) }  
    //Edita
    this.entidade.where(where).update({ $set: dados }, (err, item) => {
      cb(err, dados)
    })
  }
  
  //Deletar o registro
  delete(_id, cb: Function) {
    this.entidade.where({_id: sanitize(_id)}).remove(cb)
  }

  //Lixeira
  recycle(_id, cb: Function) {
    this.update(_id, { ativo: false }, cb)
  }
  
  //Volta lixeira
  restore(_id, cb: Function) {
    this.update(_id, { ativo: true }, cb)
  }
}