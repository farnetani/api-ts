import { Request, Response, NextFunction } from 'express'
import { CrudController } from './../../template/crud/controller'

import { UsuarioModel } from './usuario.model'
import { UsuarioValidation } from './usuario.validation'
import { UsuarioFilter } from './usuario.filter'

export class UsuarioCtrl extends CrudController {
  constructor () {
    const rotas = []
    super(rotas, UsuarioModel, UsuarioValidation, UsuarioFilter, { sessao: true })
  }

}