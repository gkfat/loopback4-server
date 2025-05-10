import {
  belongsTo,
  Entity,
  model,
  property,
} from '@loopback/repository';

import { Todo } from './todo.model';

@model()
export class Item extends Entity {

  constructor(data?: Partial<Item>) {
    super(data);
  }
  
  @property({id: true, generated: true})
  id: number;

  @property({required: true})
  content: string;

  @property({required: true})
  isCompleted: boolean;

  @property({ type: 'date' })
  completedAt: Date | null;

  @property({ type: 'date', defaultFn: 'now' })
  createdAt: Date;

  @belongsTo(() => Todo)
  todoId: number;
}

export interface ItemRelations {
  todo?: Todo;
}

export type ItemWithRelations = Item & ItemRelations;