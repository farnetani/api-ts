"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../simple/controller");
class CrudController extends controller_1.Controller {
    constructor(rotas, model, validation, filter, meta = {}) {
        // Constroe rotas
        rotas.push({ src: '/', action: 'index' });
        rotas.push({ method: 'put', src: '/', action: 'put', meta: { valida: true } });
        rotas.push({ method: 'post', src: '/get/:id', action: 'get', meta: { valida: true } });
        rotas.push({ method: 'post', src: '/:id', action: 'post', meta: { valida: true } });
        rotas.push({ method: 'delete', src: '/:id', action: 'delete' });
        super(rotas, new validation(), meta);
        //Model e Filter
        this.filter = filter;
        this.model = new model();
    }
    index(req, res, next) {
        var filter = new this.filter(req.query);
        this.model.find(filter, (err, list) => {
            if (err)
                return this.errorMsg(res, 404, 'error', 'Erro ao buscar registros', { err: err.errmsg });
            return this.succMsg(res, list);
        });
    }
    put(req, res) {
        this.model.uniqueValid(req.body, err => {
            if (err)
                return this.errorMsg(res, 500, 'unique', 'Já existe um registro com esses dados');
            this.model.create(req.body, (err, usuario) => {
                if (err || !usuario)
                    return this.errorMsg(res, 500, 'error', 'Erro ao adicionar registro');
                return this.succMsg(res, usuario);
            });
        });
    }
    get(req, res) {
        const id = req.params.id;
        this.model.getById(id, req.body.select, (err, usuario) => {
            if (err || !usuario)
                return this.errorMsg(res, 404, 'error', 'Nenhum registro encontrado');
            return this.succMsg(res, usuario);
        });
    }
    post(req, res) {
        const id = req.body._id = req.params.id;
        this.model.uniqueValid(req.body, (err) => {
            if (err)
                return this.errorMsg(res, 404, 'unique', 'Já existe um registro com esses dados');
            this.model.update(id, req.body, (err, item) => {
                if (err)
                    return this.errorMsg(res, 404, 'error', 'Erro ao editar registro');
                return this.succMsg(res, item);
            });
        });
    }
    delete(req, res) {
        const id = req.body._id = req.params.id;
        this.model.recycle(id, (err, item) => {
            if (err)
                return this.errorMsg(res, 404, 'unique', 'Registro não encontrado');
            return this.succMsg(res, { message: 'Registro excluido!' });
        });
    }
}
exports.CrudController = CrudController;
