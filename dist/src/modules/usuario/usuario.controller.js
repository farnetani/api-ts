"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./../../template/crud/controller");
const usuario_model_1 = require("./usuario.model");
const usuario_validation_1 = require("./usuario.validation");
const usuario_filter_1 = require("./usuario.filter");
class UsuarioCtrl extends controller_1.CrudController {
    constructor() {
        const rotas = [];
        super(rotas, usuario_model_1.UsuarioModel, usuario_validation_1.UsuarioValidation, usuario_filter_1.UsuarioFilter, { sessao: true });
    }
}
exports.UsuarioCtrl = UsuarioCtrl;
