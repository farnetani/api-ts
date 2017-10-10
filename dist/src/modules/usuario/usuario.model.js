"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt-nodejs");
const model_1 = require("./../../template/simple/model");
class UsuarioModel extends model_1.Model {
    constructor() {
        const fields = {
            nome: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            senha: { type: String, required: true },
        };
        const indexes = { email: 1, nome: 1 };
        const methods = ['compareHash'];
        super({ name: 'Usuario', fields, indexes, methods });
    }
    //Compara a senha
    compareHash(senha, cb) {
        bcrypt.compare(senha, this.senha, function (err, isMatch) {
            if (err)
                return cb(err, null);
            cb(null, isMatch);
        });
    }
    //Update dados senha
    hashSenha(senha, cb) {
        bcrypt.hash(senha, null, null, (err, hash) => {
            if (err)
                return cb(err);
            return cb(null, hash);
        });
    }
    find(query, cb) {
        super.find({ nome: 1, email: 1 }, query, { nome: 1 }, cb);
    }
    //Verifica se é unico
    uniqueValid(dados, cb) {
        const params = { email: dados.email };
        super.uniqueValid(dados, params, cb);
    }
    //Cria um novo usuário
    create(dados, cb) {
        this.hashSenha(dados.senha, (err, hash) => {
            if (err)
                return cb(err);
            dados.senha = hash;
            super.create(dados, cb);
        });
    }
    //Edita usuário
    update(_id, dados, cb) {
        if (dados.senha) {
            this.hashSenha(dados.senha, (err, hash) => {
                if (err)
                    return cb(err);
                dados.senha = hash;
                super.update(_id, dados, cb);
            });
        }
        else {
            super.update(_id, dados, cb);
        }
    }
    //Busca o usuário com login
    login(dados, cb) {
        this.findOne({ email: dados.email }, ['ativo', 'senha'], (err, usuario) => {
            if (err || !usuario)
                return cb({ message: 'Email não encontrado!' });
            if (!usuario.ativo)
                return cb({ message: 'Usuário inativo!' });
            usuario.compareHash(dados.senha, (err, isMatch) => {
                if (err || !isMatch)
                    return cb({ message: 'Senha incorreta!' });
                return cb(null, usuario);
            });
        });
    }
}
exports.UsuarioModel = UsuarioModel;
