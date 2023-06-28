// importa o framework express
import express from 'express';
// importa o módulo de rotas
import routes from './routes';

// define a classe App
class App {
  // cria o construtor da classe
  constructor() {
    // cria o servidor do express
    this.server = express();
    // chama o método middlewares e routes
    this.middlewares();
    this.routes();
  }

  // cria o método middlewares
  middlewares() {
    this.server.use(express.json());
  }

  // cria o método routes
  routes() {
    this.server.use(routes);
  }
}
// cria a instância da classe App utilizando o método new
export default new App().server;
