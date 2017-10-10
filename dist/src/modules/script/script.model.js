"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./../../template/simple/model");
class ScriptModel extends model_1.Model {
    constructor() {
        const fields = {
            nome: { type: String, required: true },
            pronto: { type: Boolean, required: true, default: true },
            result: {
                type: { type: String, required: true },
                json: { type: Object, required: true }
            }
        };
        const indexes = { nome: 1 };
        const methods = [];
        super({ name: 'Script', fields, indexes, methods });
    }
    findNome(nome, cb) {
        this.findOne({ nome }, ['pronto', 'result'], cb);
    }
}
exports.ScriptModel = ScriptModel;
