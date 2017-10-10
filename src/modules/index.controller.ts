import { Request, Response, NextFunction } from 'express'
import { Controller } from './../template/simple/controller'

export class IndexCtrl extends Controller {
  constructor () {
    const rotas = [
      { src: '/', action: 'index' }
    ]
    super(rotas)
  }

  index (req: Request, res: Response, next: NextFunction) {
    return res.json({ message: 'Bem vindo a API!' })
  }
}