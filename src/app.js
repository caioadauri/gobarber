import 'dotenv/config';
// importa o framework express
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import 'express-async-errors';
// importa o módulo de rotas
import routes from './routes';

import './database';

// define a classe App
class App {
  // cria o construtor da classe
  constructor() {
    // cria o servidor do express
    this.server = express();

    Sentry.init(sentryConfig);
    // chama o método middlewares e routes
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  // cria o método middlewares
  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  // cria o método routes
  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}
// cria a instância da classe App utilizando o método new
export default new App().server;
