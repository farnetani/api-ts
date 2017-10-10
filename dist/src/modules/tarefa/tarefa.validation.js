"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./../../template/crud/validation");
class TarefaValidation extends validation_1.CrudValidation {
    constructor() {
        super();
    }
    put(dados) {
        this.errorClean();
        this.forIsEmpty(dados, ['feita', 'nome']);
        return this.response();
    }
    post(dados) {
        this.errorClean();
        return this.response();
    }
}
exports.TarefaValidation = TarefaValidation;
