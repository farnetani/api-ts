"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("./../../template/simple/filter");
class AppFilter extends filter_1.Filter {
    constructor(queryParams) {
        super(queryParams);
        this.setNome();
    }
    //Seta a query de nomes
    setNome() {
        if (this.queryParams.nome) {
            this.where.nome = this.like(this.queryParams.nome);
        }
    }
}
exports.AppFilter = AppFilter;
