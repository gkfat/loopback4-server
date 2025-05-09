import * as dotenv from 'dotenv';

import {
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import { juggler } from '@loopback/repository';

dotenv.config()

const config = {
  name: 'mysql',
  connector: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

@lifeCycleObserver('datasource')
export class MysqlDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'mysql';
  constructor() {
    super(config);
  }
}
