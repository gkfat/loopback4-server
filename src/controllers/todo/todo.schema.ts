import { TodoStatus } from 'src/models/todo.model';

import { SchemaObject } from '@loopback/rest';

export const CreateTodoSchema: SchemaObject = {
    type: 'object',
    required: ['title'],
    properties: {
        title: {
            type: 'string'
        },
        subtitle: {
            type: 'string'
        },
        items: {
            type: 'array',
            items: {
                type: 'object',
                required: ['content'],
                properties: {
                    content: {
                        type: 'string'
                    }
                }
            }
        }
    }
}

export const UpdateTodoSchema: SchemaObject = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        subtitle: {
            type: 'string'
        },
        status: {
            type: 'string',
            enum: [TodoStatus.ACTIVE, TodoStatus.INACTIVE]
        }
    }
}