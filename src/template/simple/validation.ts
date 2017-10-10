export class Validation {
  status: Boolean
  err: any[]

  constructor(){
    this.errorClean()
  }

  protected errorClean() {
    this.status = true
    this.err = []
  }

  protected addError(message) {
    this.status = false
    this.err.push({ message }) 
  }

  private isEmpty(dados, field: string) {
    if(typeof(dados) == 'undefined') return true
    if(typeof(dados[field]) == 'undefined') return true
    if(dados[field] == null || (dados[field] == '' && typeof(dados[field]) != "boolean")) return true

    return false
  }

  protected forIsEmpty(dados, fields: string[]){
    fields.forEach(item => {
      if(this.isEmpty(dados, item)) {
        this.addError(`Campo ${item} não pode ser vazio!`) 
      }
    })
  }

  protected IsEmail(email){
    var expressao = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return expressao.test(email)
  }

  protected response() {
    return { status: this.status, err: this.err }
  }
}