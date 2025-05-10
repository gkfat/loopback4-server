import {
  getModelSchemaRef,
  SchemaObject,
} from '@loopback/rest';

import { ItemDto } from '../../dto/item.dto';

export const SearchItemsByTodoRequestSchema: SchemaObject = {
    type: 'object',
    required: ['todoId'],
    properties: {
        todoId: {
            type: 'number',
            description: 'Filtered todo id',
        },
        content: {
            type: 'string',
            description: 'Fuzzy search item content'
        },
        isCompleted: {
            type: 'boolean',
            description: 'Filter items with isCompleted'
        },
        page: {
            type: 'number',
            description: 'Page(start from 0)',
            default: 0
        },
        pageSize: {
            type: 'number',
            description: 'Page size',
            default: 10
        }
    }
}

export const SearchItemsByTodoResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: {
            type: 'array',
            items: getModelSchemaRef(ItemDto, { includeRelations: true })
        }
    }
}

export const GetItemByIdResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: {
            ...getModelSchemaRef(ItemDto, { includeRelations: true}),
            nullable: true
        }
    }
}

export const CreateItemRequestSchema: SchemaObject = {
    type: 'object',
    required: ['todoId', 'content', 'isCompleted'],
    properties: {
        todoId: {
            type: 'number',
            description: 'Belongs to which todo id',
        },
        content: {
            type: 'string',
            description: 'Item content'
        },
        isCompleted: {
            type: 'boolean',
            description: 'Item complete status'
        },
    }
}

export const CreateItemResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: getModelSchemaRef(ItemDto, { includeRelations: true })
    }
}

export const UpdateItemRequestSchema: SchemaObject = {
    type: 'object',
    properties: {
        content: {
            type: 'string'
        },
        isCompleted: {
            type: 'boolean'
        },
        completedAt: {
            type: 'string',
            description: 'Item completed date, ISO 8601 datetime format'
        }
    }
}

export const UpdateItemResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: getModelSchemaRef(ItemDto, { includeRelations: true })
    }
}

export const DeleteItemResponseSchema: SchemaObject = {
    type: 'object',
    properties: {
        result: {
            type: 'number',
            description: 'Item id'
        }
    }
}