import {
  model,
  property,
} from '@loopback/repository';

import { Item } from '../models/item.model';

@model()
export class ItemDto {
  @property({ type: 'number' })
  id: number;

  @property({ type: 'string' })
  content: string;

  @property({ type: 'boolean' })
  is_completed: boolean;

  @property({ type: 'string', nullable: true })
  completed_at: string | null;

  @property({ type: 'string' })
  created_at: string;

  @property({ type: 'number' })
  todo_id: number;
}

export function toItemDto(m: Item): ItemDto {
  return {
    id: m.id,
    content: m.content,
    is_completed: m.isCompleted,
    completed_at: m.completedAt?.toISOString() ?? null,
    created_at: m.createdAt.toISOString(),
    todo_id: m.todoId
  }
}
