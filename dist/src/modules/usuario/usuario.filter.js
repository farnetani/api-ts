"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("./../../template/simple/filter");
class UsuarioFilter extends filter_1.Filter {
    constructor(queryParams) {
        super(queryParams);
        this.setNome();
        this.setEmail();
    }
    //Seta a query de nomes
    setNome() {
        if (this.queryParams.nome) {
            this.where.nome = this.like(this.queryParams.nome);
        }
    }
    //Seta a query de emails
    setEmail() {
        if (this.queryParams.email) {
            this.where.email = this.like(this.queryParams.email);
        }
    }
}
exports.UsuarioFilter = UsuarioFilter;
