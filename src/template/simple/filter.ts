import UtilString from '../../util/string'

export class Filter{
  protected queryParams: any = {}
  protected where: any = {}
  protected page: Number = 1
  protected itensPorPagina: Number = 10

  constructor(queryParams: any){
    this.queryParams = queryParams //seta o query params na classe
    //Verifica página
    if(queryParams.page){
      let page: Number = parseInt(queryParams.page)
      this.page = page
    }
    //Verifica itens por pagina
    if(queryParams.qtd){
      let qtd: Number = parseInt(queryParams.qtd)
      this.itensPorPagina = qtd
    }
    //Chama os filtros padrões
    this.setAtivo()
    this.setCriado()
    this.setAlterado()
    this.setUsuario()
  }

  protected setAtivo(){
    if(this.queryParams.ativo){
      this.where.ativo = this.queryParams.ativo
    }
  }
    
  protected setCriado(){
    if(this.queryParams.criadoIni && this.queryParams.criadoFim){
      this.where.criado_em = {"$gte": this.queryParams.criadoIni, "$lt": this.queryParams.criadoFim}
    }else if(this.queryParams.criadoIni && !this.queryParams.criadoFim){
      this.where.criado_em = {"$gte": this.queryParams.criadoIni}
    }else if(!this.queryParams.criadoIni && this.queryParams.criadoFim){
      this.where.criado_em = {"$lt": this.queryParams.criadoFim}
    }
  } 
    
  protected setAlterado(){
    if(this.queryParams.alteradoIni && this.queryParams.alteradoFim){
      this.where.alterado_em = {"$gte": this.queryParams.alteradoIni, "$lt": this.queryParams.alteradoFim}
    } else if(this.queryParams.alteradoIni && !this.queryParams.alteradoFim){
      this.where.alterado_em = {"$gte": this.queryParams.alteradoIni}
    }else if(!this.queryParams.alteradoIni && this.queryParams.alteradoFim){
      this.where.alterado_em = {"$lt": this.queryParams.alteradoFim}
    }
  }  
  
  protected setUsuario(){
    if(this.queryParams._usuario){
      this.where._usuario = this.queryParams._usuario
    }
  }

  getQuery(){
    return { where: this.where, page: this.page, itensPorPagina: this.itensPorPagina }
  }

  //Funções de apoio ===================
  protected like(valor: String) {
    if(!valor) valor = ''
    var regex = new RegExp(UtilString.removerAcentos(valor), "i")
    return regex
  }    
}