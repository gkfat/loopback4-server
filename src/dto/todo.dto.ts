import {
    model,
    property,
} from '@loopback/repository';

import { TodoStatus } from '../enums';
import { Todo } from '../models';
import {
    ItemDto,
    toItemDto,
} from './';

@model()
export class TodoDto {
    @property({
        type: 'number',
        description: 'Unique todo id', 
    })
        id: number;

    @property({
        type: 'string',
        description: 'Todo title',
    })
        title: string;

    @property({
        type: 'string',
        nullable: true,
        description: 'Todo subtitle',
    })
        subtitle: string | null;

    @property({
        type: 'string',
        jsonSchema: { enum: Object.values(TodoStatus) },
        description: 'Todo status',
    })
        status: TodoStatus;

    @property({
        type: 'string',
        description: 'ISO 8601 datetime format', 
    })
        createdAt: string;

    @property({
        type: 'string',
        nullable: true, 
        description: 'ISO 8601 datetime format', 
    })
        deletedAt: string | null;

    @property.array(ItemDto)
        items: ItemDto[];
}

export function toTodoDto(m: Todo): TodoDto {
    const res: TodoDto = {
        id: m.id,
        title: m.title,
        subtitle: m.subtitle,
        status: m.status,
        createdAt: m.createdAt.toISOString(),
        deletedAt: m.deletedAt?.toISOString() ?? null,
        items: [],
    };

    if (m.items?.length) {
        res.items = m.items.map(toItemDto);
    }

    return res;
}