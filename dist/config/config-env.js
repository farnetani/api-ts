"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigEnv {
    constructor() {
        this.env = 'development';
        this.db = 'mongodb://localhost/tasklist';
        this.port = 4200;
        this.address = 'localhost';
        this.domain = 'localhost:4200';
        if (process.env.NODE_ENV == 'production') {
            this.env = "production";
            this.db = "mongodb://tasklist:senha-prod@127.0.0.1:27017/tasklist";
            this.port = 4200;
            this.address = "127.0.0.1";
            this.domain = "127.0.0.1:4200";
        }
    }
}
exports.default = new ConfigEnv();
