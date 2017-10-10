"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sanitize = require("mongo-sanitize");
class Model {
    constructor({ name, fields, indexes, methods }) {
        this.name = name;
        this.constructSchema(fields);
        this.constructIndex(indexes);
        this.constructMethods(methods);
        this.constructEntidade();
    }
    //Construir Schema
    constructSchema(fields) {
        //Padrão de controle de toda aplicação
        fields.ativo = { type: Boolean, required: true, default: true };
        fields.criado_em = { type: Date, required: true, default: Date.now };
        fields.alterado_em = { type: Date };
        this.entidade = new mongoose_1.Schema(fields);
    }
    //Constroi os indexes para otimização de pesquisa
    constructIndex(indexes) {
        indexes = Object.assign({ ativo: -1, criado_em: 1 }, indexes);
        this.entidade.index(indexes);
    }
    //Construir methods da entidade
    constructMethods(methods) {
        if (methods)
            methods.forEach(el => this.entidade.methods[methods] = this[methods]);
    }
    //Construir entidade do mongoose
    constructEntidade() {
        try {
            this.entidade = mongoose_1.model(this.name);
        }
        catch (_a) {
            this.entidade = mongoose_1.model(this.name, this.entidade);
        }
    }
    //Functions que precisa de implementação
    //Retorna uma lista de registro de acordo com parametros
    find(select, query, sort, cb, populate = false) {
        //Trata a pagina
        if (!query.page)
            query.page = 1;
        if (!query.itensPorPagina)
            query.itensPorPagina = 10;
        let limit = query.page * query.itensPorPagina;
        let skip = limit - query.itensPorPagina;
        //Trata select e sort
        select = Object.assign({ ativo: 1, criado_em: 1 }, select);
        sort = Object.assign({ ativo: -1 }, sort);
        //Executa a busca
        const busca = this.entidade.find(query.where).limit(limit).skip(skip).select(select).sort(sort);
        if (populate)
            for (let item of populate)
                query.populate(item);
        busca.exec(cb);
    }
    //Retorna um único registro
    findOne(filters, select = {}, cb, populate = false) {
        let query = this.entidade.find(filters).select(select);
        if (populate)
            for (let item of populate)
                query.populate(item);
        //Executa a busca
        query.exec((err, item) => {
            if (err || !item)
                return cb(err, item);
            return cb(err, item[0]);
        });
    }
    //Verifica se é unico
    uniqueValid(dados, params, cb) {
        this.entidade.findOne(params, function (err, item) {
            if (err)
                return cb(err);
            if (!(item == null || item._id == dados._id))
                return cb({ message: "Registro não é unico!" });
            return cb(null);
        });
    }
    //Retorna um único registro pelo ID
    getById(_id, select = {}, cb, populate = false) {
        this.findOne({ _id: sanitize(_id) }, select, cb, populate);
    }
    //Public functions
    create(dados, cb) {
        this.entidade.create(dados, cb);
    }
    //Altera um registro
    update(_id, dados, cb) {
        dados.alterado = Date.now();
        dados.__v == undefined;
        delete dados.__v;
        const where = { _id: sanitize(_id) };
        //Edita
        this.entidade.where(where).update({ $set: dados }, (err, item) => {
            cb(err, dados);
        });
    }
    //Deletar o registro
    delete(_id, cb) {
        this.entidade.where({ _id: sanitize(_id) }).remove(cb);
    }
    //Lixeira
    recycle(_id, cb) {
        this.update(_id, { ativo: false }, cb);
    }
    //Volta lixeira
    restore(_id, cb) {
        this.update(_id, { ativo: true }, cb);
    }
}
exports.Model = Model;
