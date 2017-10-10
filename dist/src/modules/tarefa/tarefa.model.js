"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_1 = require("./../../template/simple/model");
class TarefaModel extends model_1.Model {
    constructor() {
        const fields = {
            _usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario', required: true },
            feita: { type: Boolean, required: true },
            nome: { type: String, required: true }
        };
        const indexes = { feita: 1, nome: 1 };
        const methods = [];
        super({ name: 'Tarefa', fields, indexes, methods });
    }
    find(query, cb) {
        super.find({ feita: 1, nome: 1 }, query, { nome: 1 }, cb);
    }
    //Verifica se é unico
    uniqueValid(dados, cb) {
        const params = { _usuario: dados._usuario, nome: dados.nome };
        super.uniqueValid(dados, params, cb);
    }
}
exports.TarefaModel = TarefaModel;
