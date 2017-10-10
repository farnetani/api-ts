import * as mongoose from 'mongoose';

export class DatabaseConfig{
  constructor(uriDb: string){
    mongoose.connect(uriDb, { useMongoClient: true });
  }
}