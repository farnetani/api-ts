import * as http from 'http'

//Módulos de configurações
import ConfigEnv from './config/config-env'
import Server from './config/server'
import { DatabaseConfig } from './config/database-config'

//Seta a porta do app
Server.app.set('port', ConfigEnv.port)

//Inicia a conexão com o banco de dados
new DatabaseConfig(ConfigEnv.db)

const s = http.createServer(Server.app)
Server.setIo(s)
s.listen(ConfigEnv.port, ConfigEnv.address, function () {
  console.log('Aplicação ' + ConfigEnv.address + ' (' + ConfigEnv.env + '), escutando na porta ' + ConfigEnv.port)
})