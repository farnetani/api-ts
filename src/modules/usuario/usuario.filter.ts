import { Filter } from './../../template/simple/filter'

export class UsuarioFilter extends Filter{
  constructor(queryParams: any){
    super(queryParams)
    this.setNome()
    this.setEmail()
  }

  //Seta a query de nomes
  private setNome(){
    if(this.queryParams.nome){
      this.where.nome = this.like(this.queryParams.nome)
    }
  }

  //Seta a query de emails
  private setEmail(){
    if(this.queryParams.email){
      this.where.email = this.like(this.queryParams.email)
    }
  }
}