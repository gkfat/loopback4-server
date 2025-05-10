import { SchemaObject } from '@loopback/rest';

export function buildSchema(schema: SchemaObject) {
    return { content: { 'application/json': { schema } } };
}