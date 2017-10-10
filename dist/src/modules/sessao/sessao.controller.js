"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../../template/simple/controller");
const sessao_validation_1 = require("./sessao.validation");
const sessao_model_1 = require("./sessao.model");
const usuario_model_1 = require("./../usuario/usuario.model");
const request_1 = require("./../../util/request");
class SessaoCtrl extends controller_1.Controller {
    constructor() {
        // Constroe rotas
        const rotas = [
            { method: 'post', src: '/login', action: 'login', meta: { valida: true } },
            { method: 'post', src: '/continue', action: 'continue', meta: { valida: true } },
            { method: 'post', src: '/refresh', action: 'refresh', meta: { valida: true } },
            { method: 'post', src: '/logout', action: 'logout', meta: { valida: true } }
        ];
        super(rotas, new sessao_validation_1.SessaoValidation(), { app: true });
        //Model
        this.model = new sessao_model_1.SessaoModel();
        //Secret
        this.secret = 'tasklist@test';
    }
    criaSessao(req, res, usuario) {
        const usuarioM = new usuario_model_1.UsuarioModel();
        const { token, refresh, expira } = request_1.default.newToken(this.secret, usuario);
        const sessao = {
            _app: req.app,
            _usuario: usuario,
            token,
            refresh,
            expira,
            agent: request_1.default.getClientInfo(req)
        };
        this.model.create(sessao, (err, sessao) => {
            if (err || !sessao)
                return this.errorMsg(res, 500, 'error', 'Erro ao criar sessão!');
            const { token, refresh, expira } = sessao;
            //Get Usuario
            usuarioM.getById(usuario, ['nome', 'email'], (err, usuarioSessao) => {
                if (err || !usuarioSessao)
                    return this.errorMsg(res, 500, 'error', 'Erro ao encontrar sessão!');
                return this.succMsg(res, { token, refresh, expira, usuario: usuarioSessao });
            });
        });
    }
    login(req, res, next) {
        const usuario = new usuario_model_1.UsuarioModel();
        usuario.login(req.body, (err, usuario) => {
            if (err || !usuario)
                return this.errorMsg(res, 404, 'error', err.message);
            //Verifica se já existe uma sessão ativa para esse app
            this.model.sessaoAtiva(req.app, usuario._id, (sessao) => {
                if (sessao)
                    return this.succMsg(res, { message: 'Já existe uma sessao desse usuário', sessao }, 'existe');
                //Cria sessao
                this.criaSessao(req, res, usuario._id);
            });
        });
    }
    continue(req, res, next) {
        this.model.getToken(req.app, req.body._id, (err, sessao) => {
            if (err || !sessao)
                return this.errorMsg(res, 404, 'error', 'Sessão não encontrada');
            sessao.destroy('sessaoexterna', 'Outra sessão foi iniciada com o usuário', (err, old) => {
                if (err || !old)
                    return this.errorMsg(res, 500, 'error', 'Sessão não encontrada');
                //Cria sessao
                this.criaSessao(req, res, sessao._usuario);
            });
        });
    }
    refresh(req, res, next) {
        const decode = request_1.default.validaRefresh(this.secret, req.body.refresh);
        if (!decode)
            return this.errorMsg(res, 404, 'error', 'Sessão não encontrada');
        this.model.getSessaoRefresh(req.app, req.body.refresh, (err, sessao) => {
            if (err || !sessao)
                return this.errorMsg(res, 500, 'error', 'Sessão não encontrada');
            //Destroy a sessao antiga
            sessao.destroy('refresh', 'Sessao recarregada', (err, old) => {
                if (err || !old)
                    return this.errorMsg(res, 500, 'error', 'Sessão não encontrada');
                //Cria nova sessao
                this.criaSessao(req, res, sessao._usuario);
            });
        });
    }
    logout(req, res, next) {
        this.model.getSessaoToken(req.app, req.body.token, (err, sessao) => {
            if (err || !sessao)
                return this.errorMsg(res, 500, 'error', 'Sessão não encontrada');
            //Destroy a sessao
            sessao.destroy('logout', 'Sessão finalizada', (err, old) => {
                if (err || !old)
                    return this.errorMsg(res, 500, 'error', 'Sessão não encontrada');
                return this.succMsg(res, { message: 'Sessão finalizada' });
            });
        });
    }
}
exports.SessaoCtrl = SessaoCtrl;
