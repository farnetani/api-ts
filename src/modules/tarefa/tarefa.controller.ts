import { Request, Response, NextFunction } from 'express'
import { CrudController } from './../../template/crud/controller'

import { TarefaModel } from './tarefa.model'
import { TarefaValidation } from './tarefa.validation'
import { TarefaFilter } from './tarefa.filter'

export class TarefaCtrl extends CrudController {
  constructor () {
    const rotas = []
    const meta = { sessao: true, usuario: true }
    super(rotas, TarefaModel, TarefaValidation, TarefaFilter, meta)
  }

}