"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_model_1 = require("./../../modules/app/app.model");
const sessao_model_1 = require("./../../modules/sessao/sessao.model");
const log_model_1 = require("./../../modules/log/log.model");
const request_1 = require("./../../util/request");
class Controller {
    constructor(rotas, validation = false, meta = {}) {
        this.route = express_1.Router();
        this.logM = new log_model_1.LogModel();
        rotas.forEach(rota => {
            let method = rota.method || 'get';
            this[`set${method}`](rota, meta);
        });
        this.validation = validation;
    }
    errorMsg(res, code, type, message, obj = {}) {
        const json = Object.assign({ type, message }, obj);
        this.saveLog(code, json);
        return res.status(code).json(json);
    }
    succMsg(res, result, type = 'response') {
        const json = { type, result };
        this.saveLog(200, json);
        return res.json(json);
    }
    setget(rota, meta) {
        this.route.get(rota.src, [this.meta(rota, meta), this.request(rota)]);
    }
    setpost(rota, meta) {
        this.route.post(rota.src, [this.meta(rota, meta), this.request(rota)]);
    }
    setput(rota, meta) {
        this.route.put(rota.src, [this.meta(rota, meta), this.request(rota)]);
    }
    setdelete(rota, meta) {
        this.route.delete(rota.src, [this.meta(rota, meta), this.request(rota)]);
    }
    request(rota) {
        let f = [];
        if (typeof (rota.action) == 'object') {
            rota.action.forEach(element => {
                f.push(this.method(element, rota));
            });
        }
        else {
            f.push(this.method(rota.action, rota));
        }
        return f;
    }
    method(action, rota) {
        return (req, res, next) => this[action](req, res, next, rota);
    }
    meta(rota, meta) {
        const regras = Object.assign({}, meta, rota.meta);
        return (req, res, next) => {
            this.asyncMeta(regras, req, res, next, rota).then(fc => {
                if (fc.err)
                    return this.errorMsg(res, fc.err, fc.type, fc.message, fc.obj);
                return next();
            });
        };
    }
    asyncMeta(regras = {}, req, res, next, rota) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Inicia o log
                yield this.iniciaLog(req, res, rota);
                //Valida App
                yield this.validaApp(req, res, rota);
                if (req.app)
                    this.act_log._app = req.app;
                //Valida a senha do app
                if (regras.app) {
                    yield this.validaSenhaApp(req, res, rota);
                }
                //Sessao
                if (regras.sessao) {
                    yield this.validaSessao(req, res, rota);
                    if (req.user)
                        this.act_log._usuario = req.user;
                }
                //Valida rota com validation
                if (regras.valida) {
                    yield this.validaRota(req, res, rota);
                }
                //Se tiver que inserir o usuario no body
                if (regras.usuario) {
                    if (req.body)
                        req.body._usuario = req.user;
                    if (req.query)
                        req.query._usuario = req.user;
                }
            }
            catch (e) {
                return e;
            }
            return true;
        });
    }
    validaApp(req, res, rota) {
        return new Promise((resolve, reject) => {
            const app = req.headers['x-app'];
            if (!app)
                return reject({ err: 500, type: 'app', message: 'App não encontrado' });
            const appObj = new app_model_1.AppModel();
            appObj.verificaApp(app, (err, item) => {
                if (err || !item)
                    return reject({ err: 500, type: 'app', message: 'App não encontrado' });
                req.app = item._id;
                return resolve(true);
            });
        });
    }
    validaSenhaApp(req, res, rota) {
        return new Promise((resolve, reject) => {
            const secret = req.headers['x-app-senha'];
            if (!secret)
                return reject({ err: 500, type: 'app', message: 'Senha do app obrigatória' });
            const appObj = new app_model_1.AppModel();
            appObj.verificaSenhaApp(req.app, secret, (err, item) => {
                if (err || !item)
                    return reject({ err: 500, type: 'app', message: 'Senha inválida' });
                return resolve(true);
            });
        });
    }
    validaRota(req, res, rota) {
        return new Promise((resolve, reject) => {
            if (!this.validation)
                return resolve(true);
            const funcao = typeof (rota.action) == "object" ? rota.valida : rota.action;
            const valid = this.validation[funcao](req.body);
            if (!valid.status)
                return reject({ err: 500, type: 'validation', message: 'Erro na validação', obj: { fields: valid.err } });
            return resolve(true);
        });
    }
    validaSessao(req, res, rota) {
        return new Promise((resolve, reject) => {
            const token = req.headers['x-access-token'];
            if (!token)
                return reject({ err: 500, type: 'validation', message: 'Token obrigatório' });
            const sessaoObj = new sessao_model_1.SessaoModel();
            sessaoObj.getValidaSessao(req.app, token, (err, sessao) => {
                if (err || !sessao)
                    return reject({ err: 500, type: 'validation', message: 'Token inválido' });
                if (!sessao.ativo)
                    return reject({ err: 500, type: sessao.motivo_cancel.type, message: sessao.motivo_cancel.message });
                if (sessao.expira < new Date().getTime())
                    return reject({ err: 500, type: 'expirada', message: 'Sua sessão expirou, por favor faça refresh' });
                req.user = sessao._usuario;
                return resolve(true);
            });
        });
    }
    iniciaLog(req, res, rota) {
        return new Promise((resolve, reject) => {
            this.act_log = { nivel: 'api-ctrl' };
            this.act_log.url = req.originalUrl;
            this.act_log.rota = rota;
            this.act_log.request = {
                headers: req.headers,
                body: req.body,
                query: req.query,
                agent: request_1.default.getClientInfo(req)
            };
            resolve(true);
        });
    }
    saveLog(status, json) {
        this.act_log.response = { status, json };
        this.logM.create(this.act_log, () => {
            this.act_log = {};
        });
    }
}
exports.Controller = Controller;
