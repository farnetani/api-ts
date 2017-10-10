import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as cors from 'cors'
import * as socketio from 'socket.io'
import routes from './../src/app'

class Server {
  public app: express.Application

  constructor() {
    this.app = express()
    this.definitions()
    this.routes()
  }

  //Definições da aplicação
  private definitions() {
    //Middlewares de segurança
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(require('method-override')())
    this.app.use(helmet.frameguard())
    this.app.use(helmet.xssFilter())
    this.app.use(helmet.noSniff())
    this.app.use(helmet.ieNoOpen())
    this.app.disable('x-powered-by')
  }

  //Rotas
  private routes() {
    //Rotas do Aplicativo
    this.app.use(routes)

    //Erro
    this.app.get('*', function (req, res) {
      return res.status('404').json({ error: 'Method not allowed!' })
    })
    this.app.post('*', function (req, res) {
      return res.status('404').json({ error: 'Method not allowed!' })
    })
    this.app.put('*', function (req, res) {
      return res.status('404').json({ error: 'Method not allowed!' })
    })
  }

  //Instancia o socket
  public setIo(s) {
    const io = socketio(s)
    //App.socket(io)
  }
}

//Export only app
export default new Server()