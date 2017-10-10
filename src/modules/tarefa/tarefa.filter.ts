import { Filter } from './../../template/simple/filter'

export class TarefaFilter extends Filter{
  constructor(queryParams: any){
    super(queryParams)
    this.setNome()
    this.setFeita()
  }

  //Seta a query de nomes
  private setNome(){
    if(this.queryParams.nome){
      this.where.nome = this.like(this.queryParams.nome)
    }
  }
  
  //Seta a query de nomes
  private setFeita(){
    if(this.queryParams.feita){
      this.where.feita = this.queryParams.feita
    }
  }
}