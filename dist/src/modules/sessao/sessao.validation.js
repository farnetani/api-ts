"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./../../template/simple/validation");
class SessaoValidation extends validation_1.Validation {
    constructor() {
        super();
    }
    login(dados) {
        this.errorClean();
        this.forIsEmpty(dados, ['email', 'senha']);
        return this.response();
    }
    continue(dados) {
        this.errorClean();
        this.forIsEmpty(dados, ['_id']);
        return this.response();
    }
    refresh(dados) {
        this.errorClean();
        this.forIsEmpty(dados, ['refresh']);
        return this.response();
    }
    logout(dados) {
        this.errorClean();
        this.forIsEmpty(dados, ['token']);
        return this.response();
    }
}
exports.SessaoValidation = SessaoValidation;
