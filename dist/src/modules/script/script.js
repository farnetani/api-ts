"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const script_model_1 = require("./script.model");
const app_model_1 = require("./../app/app.model");
const usuario_model_1 = require("./../usuario/usuario.model");
class Script {
    constructor() {
        this.model = new script_model_1.ScriptModel();
        //Scripts para rodar
        this.insertAppPrincipal();
        this.insertUsuarioPrincipal();
    }
    ScriptPronto(nome, type, json) {
        const script = {
            nome,
            pronto: true,
            result: { type, json }
        };
        this.model.create(script, () => { });
    }
    insertAppPrincipal() {
        const nome = 'insertAppPrincipal';
        this.model.findNome(nome, (err, item) => {
            if (!item || !item.pronto) {
                const model = new app_model_1.AppModel();
                const app = { nome: 'App Web', senha: 'Sec!AppWeb@0129' };
                model.create(app, (err, insert) => {
                    if (!err && insert) {
                        this.ScriptPronto(nome, 'finalizado', insert);
                    }
                });
            }
        });
    }
    insertUsuarioPrincipal() {
        const nome = 'insertUsuarioPrincipal';
        this.model.findNome(nome, (err, item) => {
            if (!item || !item.pronto) {
                const model = new usuario_model_1.UsuarioModel();
                const usuario = { nome: 'Demo User', email: 'demo@gmail.com', senha: 'demo.123' };
                model.create(usuario, (err, insert) => {
                    if (!err && insert) {
                        this.ScriptPronto(nome, 'finalizado', insert);
                    }
                });
            }
        });
    }
}
exports.Script = Script;
