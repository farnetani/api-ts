import { Router } from 'express'

import { AppModel } from './../../modules/app/app.model'
import { SessaoModel } from './../../modules/sessao/sessao.model'
import { LogModel } from './../../modules/log/log.model'
import utilRequest from './../../util/request'

export class Controller {
  private logM: LogModel
  protected act_log: any
  public route: Router = Router()
  protected validation: any

  protected errorMsg (res, code, type, message, obj = {}) {
    const json = Object.assign({ type, message }, obj)
    this.saveLog(code, json)
    return res.status(code).json(json)
  }

  protected succMsg (res, result, type = 'response') {
    const json = { type, result }
    this.saveLog(200, json)
    return res.json(json)
  }

  constructor (rotas, validation: any = false, meta = {}) {
    this.logM = new LogModel()
    rotas.forEach(rota => {
      let method = rota.method || 'get'
      this[`set${method}`](rota, meta)
    })
    this.validation = validation
  }

  protected setget (rota, meta) {
    this.route.get(rota.src, [this.meta(rota, meta), this.request(rota)])
  }

  protected setpost (rota, meta) {
    this.route.post(rota.src, [this.meta(rota, meta), this.request(rota)])
  }

  protected setput (rota, meta) {
    this.route.put(rota.src, [this.meta(rota, meta), this.request(rota)])
  }

  protected setdelete (rota, meta) {
    this.route.delete(rota.src, [this.meta(rota, meta), this.request(rota)])
  }

  private request(rota) {
    let f = []
    if(typeof(rota.action) == 'object') {
      rota.action.forEach(element => {
        f.push(this.method(element, rota))
      })
    }else{
      f.push(this.method(rota.action, rota))
    }        
    return f
  }

  private method(action, rota) {
    return (req, res, next) => this[action](req, res, next, rota)
  }

  private meta(rota, meta) {
    const regras = Object.assign({}, meta, rota.meta)
    return (req, res, next) => {
      this.asyncMeta(regras, req, res, next, rota).then(fc => {        
        if(fc.err) return this.errorMsg(res, fc.err, fc.type, fc.message, fc.obj)
        return next()
      })
    }
  }
  
  private async asyncMeta(regras:any = {}, req, res, next, rota) {
    try {
      //Inicia o log
      await this.iniciaLog(req, res, rota)
      //Valida App
      await this.validaApp(req, res, rota)
      if(req.app) this.act_log._app = req.app
      //Valida a senha do app
      if (regras.app) {
        await this.validaSenhaApp(req, res, rota)
      }
      //Sessao
      if (regras.sessao) {
        await this.validaSessao(req, res, rota)
        if(req.user) this.act_log._usuario =  req.user
      }
      //Valida rota com validation
      if (regras.valida) {
        await this.validaRota(req, res, rota)
      }
      //Se tiver que inserir o usuario no body
      if (regras.usuario) {
        if (req.body) req.body._usuario = req.user
        if (req.query) req.query._usuario = req.user
      }
    } catch (e) {
      return e
    }
    return true
  }

  private validaApp (req, res, rota): any {
    return new Promise((resolve, reject) => {
      const app = req.headers['x-app']
      if (!app) return reject({ err: 500, type: 'app', message: 'App não encontrado' })
      const appObj = new AppModel()
      appObj.verificaApp(app, (err, item) => {
        if(err || !item) return reject({ err: 500, type: 'app', message: 'App não encontrado' })
        req.app = item._id
        return resolve(true)
      })
    })
  }

  private validaSenhaApp(req, res, rota): any {
    return new Promise((resolve, reject) => {
      const secret = req.headers['x-app-senha']
      if (!secret) return reject({ err: 500, type: 'app', message: 'Senha do app obrigatória' })
      const appObj = new AppModel()
      appObj.verificaSenhaApp(req.app, secret, (err, item) => {
        if(err || !item) return reject({ err: 500, type: 'app', message: 'Senha inválida' })
        return resolve(true)
      })
    })
  }

  private validaRota(req, res, rota: any): any {
    return new Promise((resolve, reject) => {
      if (!this.validation) return resolve(true)
      const funcao = typeof(rota.action) == "object"?rota.valida:rota.action
      const valid = this.validation[funcao](req.body)
      if (!valid.status) 
      return reject({ err: 500, type: 'validation', message: 'Erro na validação', obj: { fields: valid.err } })

      return resolve(true)
    })
  }
  
  private validaSessao(req, res, rota: any): any {
    return new Promise((resolve, reject) => {
      const token = req.headers['x-access-token']
      if(!token) return reject({ err: 500, type: 'validation', message: 'Token obrigatório' })
      const sessaoObj = new SessaoModel()
      sessaoObj.getValidaSessao(req.app, token, (err, sessao) => {
        if(err || !sessao) return reject({ err: 500, type: 'validation', message: 'Token inválido' })
        if(!sessao.ativo)
          return reject({ err: 500, type: sessao.motivo_cancel.type, message: sessao.motivo_cancel.message })
        if(sessao.expira < new Date().getTime())
          return reject({ err: 500, type: 'expirada', message: 'Sua sessão expirou, por favor faça refresh' })
        
        req.user = sessao._usuario
        return resolve(true)
      })
    })
  }

  private iniciaLog (req, res, rota): any {
    return new Promise((resolve, reject) => {
      this.act_log = { nivel: 'api-ctrl' }
      this.act_log.url = req.originalUrl
      this.act_log.rota = rota
      this.act_log.request = {
        headers: req.headers,
        body: req.body,
        query: req.query,
        agent: utilRequest.getClientInfo(req)
      }
      resolve(true)
    })
  }

  private saveLog (status, json) {
    this.act_log.response = { status, json }
    this.logM.create(this.act_log, () => {
      this.act_log = {}
    })
  }
}