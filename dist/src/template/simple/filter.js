"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../../util/string");
class Filter {
    constructor(queryParams) {
        this.queryParams = {};
        this.where = {};
        this.page = 1;
        this.itensPorPagina = 10;
        this.queryParams = queryParams; //seta o query params na classe
        //Verifica página
        if (queryParams.page) {
            let page = parseInt(queryParams.page);
            this.page = page;
        }
        //Verifica itens por pagina
        if (queryParams.qtd) {
            let qtd = parseInt(queryParams.qtd);
            this.itensPorPagina = qtd;
        }
        //Chama os filtros padrões
        this.setAtivo();
        this.setCriado();
        this.setAlterado();
        this.setUsuario();
    }
    setAtivo() {
        if (this.queryParams.ativo) {
            this.where.ativo = this.queryParams.ativo;
        }
    }
    setCriado() {
        if (this.queryParams.criadoIni && this.queryParams.criadoFim) {
            this.where.criado_em = { "$gte": this.queryParams.criadoIni, "$lt": this.queryParams.criadoFim };
        }
        else if (this.queryParams.criadoIni && !this.queryParams.criadoFim) {
            this.where.criado_em = { "$gte": this.queryParams.criadoIni };
        }
        else if (!this.queryParams.criadoIni && this.queryParams.criadoFim) {
            this.where.criado_em = { "$lt": this.queryParams.criadoFim };
        }
    }
    setAlterado() {
        if (this.queryParams.alteradoIni && this.queryParams.alteradoFim) {
            this.where.alterado_em = { "$gte": this.queryParams.alteradoIni, "$lt": this.queryParams.alteradoFim };
        }
        else if (this.queryParams.alteradoIni && !this.queryParams.alteradoFim) {
            this.where.alterado_em = { "$gte": this.queryParams.alteradoIni };
        }
        else if (!this.queryParams.alteradoIni && this.queryParams.alteradoFim) {
            this.where.alterado_em = { "$lt": this.queryParams.alteradoFim };
        }
    }
    setUsuario() {
        if (this.queryParams._usuario) {
            this.where._usuario = this.queryParams._usuario;
        }
    }
    getQuery() {
        return { where: this.where, page: this.page, itensPorPagina: this.itensPorPagina };
    }
    //Funções de apoio ===================
    like(valor) {
        if (!valor)
            valor = '';
        var regex = new RegExp(string_1.default.removerAcentos(valor), "i");
        return regex;
    }
}
exports.Filter = Filter;
