"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./../../template/crud/validation");
class AppValidation extends validation_1.CrudValidation {
    constructor() {
        super();
    }
    senha(pass) {
        if (pass) {
            let regex = /^(?=(?:.*?[a-zA-Z]){1})(?=(?:.*?[0-9]){1})(?=(?:.*?[!@#$%*()_+^&}{:?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%*()_+^&}{:?.]*$/;
            if (pass.length < 15) {
                this.addError('Senha precisa ter no mínimo 15 caracteres!');
            }
            if (!regex.exec(pass)) {
                this.addError('Senha precisa ter letras, números e caracteres especiais!');
            }
        }
    }
    put(dados) {
        this.errorClean();
        this.forIsEmpty(dados, ['nome', 'senha']);
        this.senha(dados.senha);
        return this.response();
    }
    post(dados) {
        this.errorClean();
        if (dados.senha)
            this.senha(dados.senha);
        return this.response();
    }
}
exports.AppValidation = AppValidation;
