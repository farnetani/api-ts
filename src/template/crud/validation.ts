import { Validation } from '../simple/validation'

export interface CrudValidationInterface {
  put (dados)
  post (dados)
}

export class CrudValidation extends Validation {
  constructor() {
    super()
  }

  private select(select) {
    if(typeof(select) != "object") {
      this.addError('Select precisa ser um objeto!')
    }    
  }

  get (dados) {
    this.errorClean()
    this.forIsEmpty(dados, ['select'])
    this.select(dados.select)

    return this.response()
  }

}