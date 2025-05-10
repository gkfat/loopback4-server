import {
    model,
    property,
} from '@loopback/repository';

import { Item } from '../models';

@model()
export class ItemDto {
  @property({
      type: 'number',
      description: 'Unique item id', 
  })
      id: number;

  @property({ type: 'string' })
      content: string;

  @property({
      type: 'boolean',
      description: 'Item is completed or not', 
  })
      isCompleted: boolean;

  @property({
      type: 'string',
      nullable: true, 
      description: 'Item completed time ISO 8601 datetime', 
  })
      completedAt: string | null;

  @property({
      type: 'string',
      description: 'Item completed time ISO 8601 datetime', 
  })
      createdAt: string;

  @property({ type: 'number' })
      todoId: number;
}

export function toItemDto(m: Item): ItemDto {
    return {
        id: m.id,
        content: m.content,
        isCompleted: m.isCompleted,
        completedAt: m.completedAt?.toISOString() ?? null,
        createdAt: m.createdAt.toISOString(),
        todoId: m.todoId,
    };
}
