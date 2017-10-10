"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../simple/validation");
class CrudValidation extends validation_1.Validation {
    constructor() {
        super();
    }
    select(select) {
        if (typeof (select) != "object") {
            this.addError('Select precisa ser um objeto!');
        }
    }
    get(dados) {
        this.errorClean();
        this.forIsEmpty(dados, ['select']);
        this.select(dados.select);
        return this.response();
    }
}
exports.CrudValidation = CrudValidation;
