"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("./../../template/simple/filter");
class TarefaFilter extends filter_1.Filter {
    constructor(queryParams) {
        super(queryParams);
        this.setNome();
        this.setFeita();
    }
    //Seta a query de nomes
    setNome() {
        if (this.queryParams.nome) {
            this.where.nome = this.like(this.queryParams.nome);
        }
    }
    //Seta a query de nomes
    setFeita() {
        if (this.queryParams.feita) {
            this.where.feita = this.queryParams.feita;
        }
    }
}
exports.TarefaFilter = TarefaFilter;
