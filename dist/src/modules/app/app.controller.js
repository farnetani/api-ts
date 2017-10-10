"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./../../template/crud/controller");
const app_model_1 = require("./app.model");
const app_validation_1 = require("./app.validation");
const app_filter_1 = require("./app.filter");
class AppCtrl extends controller_1.CrudController {
    constructor() {
        const rotas = [];
        super(rotas, app_model_1.AppModel, app_validation_1.AppValidation, app_filter_1.AppFilter, { sessao: true });
    }
}
exports.AppCtrl = AppCtrl;
