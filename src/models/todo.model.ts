import {
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';

import { Item } from './item.model';

export enum TodoStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
  }

@model()
export class Todo extends Entity {

    constructor(data?: Partial<Todo>) {
      super(data);
    }

    @property({ type: 'number', id: true, generated: true })
    id: number;

    @property({ type: 'string', required: true })
    title: string;

    @property({ type: 'string' })
    subtitle: string | null;

    @property({
      type: 'string',
      jsonSchema: {
        enum: Object.values(TodoStatus),
      },
      default: TodoStatus.ACTIVE,
    })
    status: TodoStatus;

    @property({type: 'date', defaultFn: 'now'})
    createdAt: Date;

    // Todo is soft delete
    @property({ type: 'date' })
    deletedAt: Date | null;

    @hasMany(() => Item)
    items: Item[];
}


export interface TodoRelations {
  items?: Item[];
}

export type TodoWithRelations = Todo & TodoRelations;