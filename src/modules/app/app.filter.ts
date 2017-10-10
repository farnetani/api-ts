import { Filter } from './../../template/simple/filter'

export class AppFilter extends Filter{
  constructor(queryParams: any){
    super(queryParams)
    this.setNome()
  }

  //Seta a query de nomes
  private setNome(){
    if(this.queryParams.nome){
      this.where.nome = this.like(this.queryParams.nome)
    }
  }
}