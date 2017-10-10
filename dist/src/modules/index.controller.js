"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./../template/simple/controller");
class IndexCtrl extends controller_1.Controller {
    constructor() {
        const rotas = [
            { src: '/', action: 'index' }
        ];
        super(rotas);
    }
    index(req, res, next) {
        return res.json({ message: 'Bem vindo a API!' });
    }
}
exports.IndexCtrl = IndexCtrl;
