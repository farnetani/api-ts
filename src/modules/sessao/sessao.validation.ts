import { Validation } from './../../template/simple/validation'

export class SessaoValidation extends Validation{
  constructor() {
    super()
  }

  login (dados){
    this.errorClean()
    this.forIsEmpty(dados, ['email', 'senha'])

    return this.response()
  }

  continue (dados) {
    this.errorClean()
    this.forIsEmpty(dados, ['_id'])

    return this.response()
  }
  
  refresh (dados) {
    this.errorClean()
    this.forIsEmpty(dados, ['refresh'])
  
    return this.response()
  }
  
  logout (dados) {
    this.errorClean()
    this.forIsEmpty(dados, ['token'])
  
    return this.response()
  }

}