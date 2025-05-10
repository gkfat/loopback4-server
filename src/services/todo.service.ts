import {
    BindingScope,
    injectable,
} from '@loopback/core';
import {
    Filter,
    repository,
} from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';

import { toTodoDto } from '../dto';
import { TodoStatus } from '../enums';
import { Todo } from '../models';
import { TodoRepository } from '../repositories';
import { isDefined } from '../utils/common';

@injectable({ scope: BindingScope.TRANSIENT })
export class TodoService {
    constructor(
    @repository(TodoRepository)
    private todoRepo: TodoRepository,
    ) {}

    async list(reqBody: {
        title?: string;
        page: number;
        pageSize: number;
    }) {
        const {
            title,
            page,
            pageSize,
        } = reqBody;

        const skip = (page) * pageSize;

        const filter: Filter<Todo> = {
            where: {
                ...(
                    title
                        ? { title: { like: `%${title}%` } }
                        : {}
                ),
                deletedAt: { eq: null },
            },
            limit: pageSize,
            skip,
            include: [{ relation: 'items' }],
        };

        const res = await this.todoRepo.find(filter);
    
        return res.map(toTodoDto);
    }

    async findById(id: number) {
        const filter: Filter<Todo> = {
            where: {
                id,
                deletedAt: { eq: null }, 
            },
            include: [{ relation: 'items' }],
        };

        const res = await this.todoRepo.findOne(filter);

        return res ? toTodoDto(res) : null;
    }

    async create(reqBody: {
        title: string;
        subtitle?: string;
        items?: {
        content: string;
        isCompleted: boolean;
        }[];
    }) {
        const {
            title,
            subtitle,
            items,
        } = reqBody;

        const newTodo = await this.todoRepo.create({
            title,
            subtitle,
            status: TodoStatus.ACTIVE,
        });

        if (items?.length) {
            await Promise.all(
                items?.map((item) => this.todoRepo.items(newTodo.id).create({
                    content: item.content,
                    isCompleted: item.isCompleted,
                    todoId: newTodo.id,
                }))
            );
        }

        return this.findById(newTodo.id);
    }

    async update(reqBody: {
        id: number;
        title?: string;
        subtitle?: string;
        status?: Exclude<TodoStatus, TodoStatus.DELETED>;
    }) {
        const {
            id,
            title,
            subtitle,
            status,
        } = reqBody;

        const findTodo = await this.todoRepo.findOne({
            where: {
                id,
                deletedAt: { eq: null },
            },
        });

        if (!findTodo) {
            throw new HttpErrors.NotFound(`Todo ${id} not found`);
        }

        if (isDefined(title)) {
            findTodo.title = title;
        }

        if (isDefined(subtitle)) {
            findTodo.subtitle = subtitle;
        }

        if (isDefined(status)) {
            findTodo.status = status;
        }

        await this.todoRepo.save(findTodo);

        return this.findById(id);
    }

    async deleteById(id: number) {
        const findTodo = await this.todoRepo.findOne({
            where: {
                id,
                deletedAt: { eq: null },
            },
        });

        if (!findTodo) {
            throw new HttpErrors.NotFound(`Todo ${id} not found`);
        }

        findTodo.deletedAt = new Date();
        findTodo.status = TodoStatus.DELETED;

        await this.todoRepo.save(findTodo);

        return id;
    }
}
