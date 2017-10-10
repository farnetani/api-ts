"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./../../template/crud/validation");
class UsuarioValidation extends validation_1.CrudValidation {
    constructor() {
        super();
    }
    senha(pass) {
        if (pass) {
            let regex = /^(?=(?:.*?[a-zA-Z]){1})(?=(?:.*?[0-9]){1})(?=(?:.*?[!@#$%*()_+^&}{:?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%*()_+^&}{:?.]*$/;
            if (pass.length < 8) {
                this.addError('Senha precisa ter no mínimo 8 caracteres!');
            }
            if (!regex.exec(pass)) {
                this.addError('Senha precisa ter letras, números e caracteres especiais!');
            }
        }
    }
    email(email) {
        if (!this.IsEmail(email)) {
            this.addError('E-mail inválido!');
        }
    }
    put(dados) {
        this.errorClean();
        this.forIsEmpty(dados, ['nome', 'email', 'senha']);
        this.email(dados.email);
        this.senha(dados.senha);
        return this.response();
    }
    post(dados) {
        this.errorClean();
        if (dados.email)
            this.email(dados.email);
        if (dados.senha)
            this.senha(dados.senha);
        return this.response();
    }
}
exports.UsuarioValidation = UsuarioValidation;
