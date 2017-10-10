import { Request, Response, NextFunction } from 'express'
import { CrudController } from './../../template/crud/controller'

import { AppModel } from './app.model'
import { AppValidation } from './app.validation'
import { AppFilter } from './app.filter'

export class AppCtrl extends CrudController {
  constructor () {
    const rotas = []
    super(rotas, AppModel, AppValidation, AppFilter, { sessao: true })
  }

}