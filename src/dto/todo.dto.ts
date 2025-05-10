import {
  model,
  property,
} from '@loopback/repository';

import {
  Todo,
  TodoStatus,
} from '../models/todo.model';
import {
  ItemDto,
  toItemDto,
} from './item.dto';

@model()
export class TodoDto {
    @property({ type: 'number' })
    id: number;

    @property({ type: 'string' })
    title: string;

    @property({ type: 'string', nullable: true })
    subtitle: string | null;

    @property({
        type: 'string',
        jsonSchema: {
          enum: Object.values(TodoStatus),
        },
    })
    status: TodoStatus;

    @property({ type: 'string'})
    created_at: string;

    @property({ type: 'string', nullable: true })
    deleted_at: string | null;

    @property.array(ItemDto)
    items: ItemDto[];
}

export function toTodoDto(m: Todo): TodoDto {
  const res: TodoDto = {
    id: m.id,
    title: m.title,
    subtitle: m.subtitle,
    status: m.status,
    created_at: m.createdAt.toISOString(),
    deleted_at: m.deletedAt?.toISOString() ?? null,
    items: [],
  }

  if (m.items?.length) {
    res.items = m.items.map(toItemDto)
  }

  return res;
}