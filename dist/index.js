"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
//Módulos de configurações
const config_env_1 = require("./config/config-env");
const server_1 = require("./config/server");
const database_config_1 = require("./config/database-config");
//Seta a porta do app
server_1.default.app.set('port', config_env_1.default.port);
//Inicia a conexão com o banco de dados
new database_config_1.DatabaseConfig(config_env_1.default.db);
const s = http.createServer(server_1.default.app);
server_1.default.setIo(s);
s.listen(config_env_1.default.port, config_env_1.default.address, function () {
    console.log('Aplicação ' + config_env_1.default.address + ' (' + config_env_1.default.env + '), escutando na porta ' + config_env_1.default.port);
});
