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

    @property({ id: true, generated: true })
    id: number;

    @property({ required: true })
    title: string;

    @property()
    subtitle?: string;

    @property({
      type: 'string',
      jsonSchema: {
        enum: Object.values(TodoStatus),
      },
      default: TodoStatus.ACTIVE,
    })
    status: TodoStatus;

    @property({type: 'date', defaultFn: 'now'})
    created_at: Date;

    // Todo is soft delete
    @property({type: 'date'})
    deleted_at: Date;

    @hasMany(() => Item)
    items: Item[];
}


export interface TodoRelations {
  items?: Item[];
}

export type TodoWithRelations = Todo & TodoRelations;