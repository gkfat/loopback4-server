import { MysqlDataSource } from 'src/datasources/mysql.datasource';
import {
  Item,
  ItemRelations,
} from 'src/models/item.model';
import { Todo } from 'src/models/todo.model';

import {
  Getter,
  inject,
} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';

import { TodoRepository } from './todo.repository';

export class ItemRepository extends DefaultCrudRepository<
  Item,
  typeof Item.prototype.id,
  ItemRelations
> {
  public readonly todo: BelongsToAccessor<Todo, typeof Item.prototype.id>;
  
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('TodoRepository')
    protected todoRepositoryGetter: Getter<TodoRepository>,
  ) {
    super(Item, dataSource);
    
    this.todo = this.createBelongsToAccessorFor('todo', todoRepositoryGetter);
    this.registerInclusionResolver('todo', this.todo.inclusionResolver);
  }
  
}
