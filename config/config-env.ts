class ConfigEnv {
  public env: string = 'development';
  public db: string = 'mongodb://localhost/tasklist';
  public port: number = 4200;
  public address: string = 'localhost';
  public domain: string = 'localhost:4200';

  constructor() {
    if (process.env.NODE_ENV == 'production') {
      this.env = "production";
      this.db = "mongodb://tasklist:senha-prod@127.0.0.1:27017/tasklist";
      this.port = 4200;
      this.address = "127.0.0.1";
      this.domain = "127.0.0.1:4200";
    }
  }
}

export default new ConfigEnv();