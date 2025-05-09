import { MysqlDataSource } from 'src/datasources/mysql.datasource';
import { Item } from 'src/models/item.model';
import {
  Todo,
  TodoRelations,
} from 'src/models/todo.model';

import {
  Getter,
  inject,
} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';

import { ItemRepository } from './item.repository';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {
  public readonly items: HasManyRepositoryFactory<Item, typeof Todo.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('ItemRepository')
    protected itemRepositoryGetter: Getter<ItemRepository>,
  ) {
    super(Todo, dataSource);

    this.items = this.createHasManyRepositoryFactoryFor(
      'items',
      itemRepositoryGetter,
    )

    this.registerInclusionResolver('items', this.items.inclusionResolver)
  }
}
