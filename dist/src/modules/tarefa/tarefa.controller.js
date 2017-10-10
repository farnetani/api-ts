"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./../../template/crud/controller");
const tarefa_model_1 = require("./tarefa.model");
const tarefa_validation_1 = require("./tarefa.validation");
const tarefa_filter_1 = require("./tarefa.filter");
class TarefaCtrl extends controller_1.CrudController {
    constructor() {
        const rotas = [];
        const meta = { sessao: true, usuario: true };
        super(rotas, tarefa_model_1.TarefaModel, tarefa_validation_1.TarefaValidation, tarefa_filter_1.TarefaFilter, meta);
    }
}
exports.TarefaCtrl = TarefaCtrl;
