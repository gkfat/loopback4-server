import {
  getModelSchemaRef,
  SchemaObject,
} from '@loopback/rest';

import { TodoDto } from '../../dto/todo.dto';
import { TodoStatus } from '../../models/todo.model';

export const GetTodosResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: {
            type: 'array',
            items: getModelSchemaRef(TodoDto, { includeRelations: true })
        }
    }
}

export const GetTodoByIdResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: {
            ...getModelSchemaRef(TodoDto, { includeRelations: true}),
            nullable: true
        }
    }
}

export const CreateTodoRequestSchema: SchemaObject = {
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

export const CreateTodoResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: getModelSchemaRef(TodoDto, { includeRelations: true })
    }
}

export const UpdateTodoRequestSchema: SchemaObject = {
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

export const UpdateTodoResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: getModelSchemaRef(TodoDto, { includeRelations: true })
    }
}

export const DeleteTodoResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: {
            type: 'number'
        }
    }
}