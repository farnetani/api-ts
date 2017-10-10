"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validation {
    constructor() {
        this.errorClean();
    }
    errorClean() {
        this.status = true;
        this.err = [];
    }
    addError(message) {
        this.status = false;
        this.err.push({ message });
    }
    isEmpty(dados, field) {
        if (typeof (dados) == 'undefined')
            return true;
        if (typeof (dados[field]) == 'undefined')
            return true;
        if (dados[field] == null || (dados[field] == '' && typeof (dados[field]) != "boolean"))
            return true;
        return false;
    }
    forIsEmpty(dados, fields) {
        fields.forEach(item => {
            if (this.isEmpty(dados, item)) {
                this.addError(`Campo ${item} não pode ser vazio!`);
            }
        });
    }
    IsEmail(email) {
        var expressao = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return expressao.test(email);
    }
    response() {
        return { status: this.status, err: this.err };
    }
}
exports.Validation = Validation;
