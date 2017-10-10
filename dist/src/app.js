"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const script_1 = require("./modules/script/script");
const app_controller_1 = require("./modules/app/app.controller");
const index_controller_1 = require("./modules/index.controller");
const sessao_controller_1 = require("./modules/sessao/sessao.controller");
const usuario_controller_1 = require("./modules/usuario/usuario.controller");
const tarefa_controller_1 = require("./modules/tarefa/tarefa.controller");
//Roda os Scripts
new script_1.Script();
//Rotas principais da API
const routes = [
    { src: '/', ctrl: new index_controller_1.IndexCtrl().route },
    { src: '/usuario', ctrl: new usuario_controller_1.UsuarioCtrl().route },
    { src: '/app', ctrl: new app_controller_1.AppCtrl().route },
    { src: '/sessao', ctrl: new sessao_controller_1.SessaoCtrl().route },
    { src: '/tarefa', ctrl: new tarefa_controller_1.TarefaCtrl().route }
];
//Constroe rotas
const rt = express_1.Router();
routes.forEach(el => {
    rt.use(el.src, el.ctrl);
});
exports.default = rt;
