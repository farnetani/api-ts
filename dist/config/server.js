"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const socketio = require("socket.io");
const app_1 = require("./../src/app");
class Server {
    constructor() {
        this.app = express();
        this.definitions();
        this.routes();
    }
    //Definições da aplicação
    definitions() {
        //Middlewares de segurança
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(require('method-override')());
        this.app.use(helmet.frameguard());
        this.app.use(helmet.xssFilter());
        this.app.use(helmet.noSniff());
        this.app.use(helmet.ieNoOpen());
        this.app.disable('x-powered-by');
    }
    //Rotas
    routes() {
        //Rotas do Aplicativo
        this.app.use(app_1.default);
        //Erro
        this.app.get('*', function (req, res) {
            return res.status('404').json({ error: 'Method not allowed!' });
        });
        this.app.post('*', function (req, res) {
            return res.status('404').json({ error: 'Method not allowed!' });
        });
        this.app.put('*', function (req, res) {
            return res.status('404').json({ error: 'Method not allowed!' });
        });
    }
    //Instancia o socket
    setIo(s) {
        const io = socketio(s);
        //App.socket(io)
    }
}
//Export only app
exports.default = new Server();
