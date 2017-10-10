"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_1 = require("./../../template/simple/model");
class SessaoModel extends model_1.Model {
    constructor() {
        let fields = {
            _app: { type: mongoose_1.Schema.Types.ObjectId, ref: 'App', required: true },
            _usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario', required: true },
            token: { type: String, required: true },
            refresh: { type: String, required: true },
            expira: { type: Date, required: true },
            agent: {
                device: { type: String, required: true },
                ip: { type: String, required: true },
                browser: {
                    name: { type: String, required: false },
                    version: { type: String, required: false },
                },
                engine: {
                    name: { type: String, required: false },
                    version: { type: String, required: false }
                },
                os: {
                    name: { type: String, required: false },
                    version: { type: String, required: false }
                }
            },
            motivo_cancel: {
                type: { type: String, required: false },
                message: { type: String, required: false }
            }
        };
        let indexes = { _app: 1, _usuario: 1, token: 1, refresh: 1, agent: 1 };
        const methods = ['destroy'];
        super({ name: 'Sessao', fields, indexes, methods });
    }
    destroy(type, message, cb) {
        this.ativo = false;
        this.motivo_cancel = { type, message };
        this.save(cb);
    }
    getSessaoRefresh(_app, refresh, cb) {
        this.findOne({ _app, refresh, ativo: true }, ['_id', '_usuario'], cb);
    }
    getSessaoToken(_app, token, cb) {
        this.findOne({ _app, token, ativo: true }, ['_id', '_usuario'], cb);
    }
    getValidaSessao(_app, token, cb) {
        this.findOne({ _app, token }, [
            '_id', '_usuario', 'expira', 'ativo', 'motivo_cancel'
        ], cb);
    }
    sessaoAtiva(_app, _usuario, cb) {
        this.findOne({ _app, _usuario, ativo: true }, [
            '_id', 'agent'
        ], (err, sessao) => {
            if (err)
                return cb(false);
            if (!sessao)
                return cb(false);
            //Se a sessao já estiver expirada inativa ela
            if (sessao.expira < Date.now()) {
                sessao.destroy('novasessao', 'Sua sessão expirou e outra sessao foi iniciada', (err, item) => {
                    if (err)
                        return cb(false);
                    return cb(false);
                });
            }
            else {
                const { _id, agent } = sessao;
                return cb({ _id, agent });
            }
        });
    }
    getToken(_app, _id, cb) {
        this.findOne({ _app, _id, ativo: true }, ['_id', '_usuario'], cb);
    }
}
exports.SessaoModel = SessaoModel;
