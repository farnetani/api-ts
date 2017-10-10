import { Router } from 'express'
import { Script } from './modules/script/script'
import { AppCtrl } from './modules/app/app.controller'
import { IndexCtrl } from './modules/index.controller'
import { SessaoCtrl } from './modules/sessao/sessao.controller'
import { UsuarioCtrl } from './modules/usuario/usuario.controller'
import { TarefaCtrl } from './modules/tarefa/tarefa.controller'

//Roda os Scripts
new Script()

//Rotas principais da API
const routes = [
  { src: '/', ctrl: new IndexCtrl().route },
  { src: '/usuario', ctrl: new UsuarioCtrl().route },
  { src: '/app', ctrl: new AppCtrl().route },
  { src: '/sessao', ctrl: new SessaoCtrl().route },
  { src: '/tarefa', ctrl: new TarefaCtrl().route }
]

//Constroe rotas
const rt = Router()
routes.forEach(el => {
  rt.use(el.src, el.ctrl)
})
export default rt