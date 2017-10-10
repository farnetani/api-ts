import { Schema } from 'mongoose'
import * as bcrypt from 'bcrypt-nodejs'
import { Model } from './../../template/simple/model'
import { CrudModel } from './../../template/crud/model'

export class TarefaModel extends Model implements CrudModel{
constructor() {
    const fields = {
      _usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true},
      feita: {type: Boolean, required: true},
      nome: {type: String, required: true}
    }
    const indexes = { feita: 1, nome: 1 }
    const methods = []
    super({ name: 'Tarefa', fields, indexes, methods })
  }

  find (query: any, cb: Function) {
    super.find({ feita:1, nome: 1 }, query, { nome: 1 }, cb)
  }

  //Verifica se é unico
  uniqueValid (dados, cb) {
    const params = { _usuario: dados._usuario, nome: dados.nome }
    super.uniqueValid(dados, params, cb)
  }

}