import { CrudValidation, CrudValidationInterface } from './../../template/crud/validation'

export class TarefaValidation extends CrudValidation implements CrudValidationInterface{
  constructor() {
    super()
  }

  put (dados) {
    this.errorClean()    
    this.forIsEmpty(dados, ['feita', 'nome'])

    return this.response()
  }

  post (dados) {
    this.errorClean()
    
    return this.response()
  }

}