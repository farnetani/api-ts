export interface CrudModel {
  find (query: any, cb: Function)
  uniqueValid (dados, cb)
}