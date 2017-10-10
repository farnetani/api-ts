import { Request, Response, NextFunction } from 'express'
import { Controller } from '../../template/simple/controller'

import { SessaoValidation } from './sessao.validation'
import { SessaoFilter } from './sessao.filter'
import { SessaoModel } from './sessao.model'

import { UsuarioModel } from './../usuario/usuario.model'
import utilRequest from './../../util/request'

export class SessaoCtrl extends Controller {
  private secret: String
  protected model: any

  constructor () {
    // Constroe rotas
    const rotas = [
      { method:'post', src: '/login', action: 'login', meta: { valida: true } },
      { method:'post', src: '/continue', action: 'continue', meta: { valida: true } },
      { method:'post', src: '/refresh', action: 'refresh', meta: { valida: true } },
      { method:'post', src: '/logout', action: 'logout', meta: { valida: true } }
    ]
    super(rotas, new SessaoValidation(), { app: true })

    //Model
    this.model = new SessaoModel()
    //Secret
    this.secret = 'tasklist@test'
  }

  private criaSessao(req, res, usuario) {
    const usuarioM = new UsuarioModel()
    const { token, refresh, expira } = utilRequest.newToken(this.secret, usuario)
    const sessao = {
      _app: req.app,
      _usuario: usuario,
      token,
      refresh,
      expira,
      agent: utilRequest.getClientInfo(req)
    }
    this.model.create(sessao, (err, sessao) => {
      if(err || !sessao) return this.errorMsg(res, 500, 'error', 'Erro ao criar sessão!')
      const { token, refresh, expira } = sessao

      //Get Usuario
      usuarioM.getById(usuario, ['nome', 'email'], (err, usuarioSessao) => {
        if(err || !usuarioSessao) return this.errorMsg(res, 500, 'error', 'Erro ao encontrar sessão!')  

        return this.succMsg(res, { token, refresh, expira, usuario: usuarioSessao })
      })
    })
  }

  login (req: Request, res: Response, next: NextFunction) {
    const usuario = new UsuarioModel()
    usuario.login(req.body, (err, usuario) => {
      if (err || !usuario) return this.errorMsg(res, 404, 'error', err.message)

      //Verifica se já existe uma sessão ativa para esse app
      this.model.sessaoAtiva(req.app, usuario._id, (sessao) => {
        if(sessao) return this.succMsg(res, { message: 'Já existe uma sessao desse usuário', sessao }, 'existe')
        //Cria sessao
        this.criaSessao(req, res, usuario._id)
      })      
    })
  }

  continue (req: Request, res: Response, next: NextFunction) {
    this.model.getToken(req.app, req.body._id, (err, sessao) => {
      if(err || !sessao) return this.errorMsg(res, 404, 'error', 'Sessão não encontrada')
      sessao.destroy('sessaoexterna', 'Outra sessão foi iniciada com o usuário', (err, old) => {
        if(err || !old) return this.errorMsg(res, 500, 'error', 'Sessão não encontrada')
        //Cria sessao
        this.criaSessao(req, res, sessao._usuario)
      })
    })
  }

  refresh (req: Request, res: Response, next: NextFunction) {
    const decode = utilRequest.validaRefresh(this.secret, req.body.refresh)
    if(!decode) return this.errorMsg(res, 404, 'error', 'Sessão não encontrada')

    this.model.getSessaoRefresh(req.app, req.body.refresh, (err, sessao) => {
      if(err || !sessao) return this.errorMsg(res, 500, 'error', 'Sessão não encontrada')
      //Destroy a sessao antiga
      sessao.destroy('refresh', 'Sessao recarregada', (err, old) => {
        if(err || !old) return this.errorMsg(res, 500, 'error', 'Sessão não encontrada')
        //Cria nova sessao
        this.criaSessao(req, res, sessao._usuario)
      })
    })
  }
  
  logout (req: Request, res: Response, next: NextFunction) {
    this.model.getSessaoToken(req.app, req.body.token, (err, sessao) => {
      if(err || !sessao) return this.errorMsg(res, 500, 'error', 'Sessão não encontrada')
      //Destroy a sessao
      sessao.destroy('logout', 'Sessão finalizada', (err, old) => {
        if(err || !old) return this.errorMsg(res, 500, 'error', 'Sessão não encontrada')
        return this.succMsg(res, { message: 'Sessão finalizada' })
      })
    })
  }

}