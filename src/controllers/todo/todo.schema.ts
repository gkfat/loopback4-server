import {
    getModelSchemaRef,
    SchemaObject,
} from '@loopback/rest';

import { TodoDto } from '../../dto';
import { TodoStatus } from '../../enums';

export const SearchTodosRequestSchema: SchemaObject = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            description: 'Fuzzy search todo title',
        },
        page: {
            type: 'number',
            description: 'Page(start from 0)',
            default: 0,
        },
        pageSize: {
            type: 'number',
            description: 'Page size',
            default: 10,
        },
    },
};

export const SearchTodosResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: {
            type: 'array',
            items: getModelSchemaRef(TodoDto, { includeRelations: true }),
        },
    },
};

export const GetTodoByIdResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: {
            ...getModelSchemaRef(TodoDto, { includeRelations: true }),
            nullable: true,
        },
    },
};

export const CreateTodoRequestSchema: SchemaObject = {
    type: 'object',
    required: ['title'],
    properties: {
        title: {
            type: 'string',
            description: 'Todo title',
        },
        subtitle: {
            type: 'string',
            description: 'Todo subtitle',
        },
        items: {
            type: 'array',
            description: 'Items belong to this todo',
            items: {
                type: 'object',
                required: ['content', 'isCompleted'],
                properties: {
                    content: {
                        type: 'string',
                        description: 'Item content',
                    },
                    isCompleted: {
                        type: 'boolean',
                        description: 'Item complete status',
                    },
                },
            },
        },
    },
};

export const CreateTodoResponseSchema: SchemaObject = {
    type: 'object',
    properties: { result: getModelSchemaRef(TodoDto, { includeRelations: true }) },
};

export const UpdateTodoRequestSchema: SchemaObject = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        status: {
            type: 'string',
            enum: [TodoStatus.ACTIVE, TodoStatus.INACTIVE],
        },
    },
};

export const UpdateTodoResponseSchema: SchemaObject = {
    type: 'object',
    properties: { result: getModelSchemaRef(TodoDto, { includeRelations: true }) },
};

export const DeleteTodoResponseSchema: SchemaObject = {
    type: 'object',
    properties: { result: { type: 'number' } },
};