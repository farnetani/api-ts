"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_1 = require("./../../template/simple/model");
class LogModel extends model_1.Model {
    constructor() {
        const fields = {
            _app: { type: mongoose_1.Schema.Types.ObjectId, ref: 'App', required: false },
            _usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario', required: false },
            nivel: { type: String, required: true },
            url: { type: String, required: true },
            rota: { type: Object, required: true },
            request: {
                headers: { type: Object, required: true },
                body: { type: Object, required: true },
                query: { type: Object, required: true },
                agent: { type: Object, required: true }
            },
            response: {
                status: { type: Number, required: true, default: 200 },
                json: { type: Object, required: true }
            }
        };
        const indexes = { _app: 1, _usuario: 1, nivel: 1, url: 1, rota: 1 };
        const methods = [];
        super({ name: 'Log', fields, indexes, methods });
    }
}
exports.LogModel = LogModel;
