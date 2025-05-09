import {
  Todo,
  TodoRelations,
  TodoStatus,
} from 'src/models/todo.model';

import {
  BindingScope,
  injectable,
} from '@loopback/core';
import {
  Filter,
  repository,
} from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';

import {
  ItemRepository,
  TodoRepository,
} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class TodoService {
  constructor(
    @repository(TodoRepository)
    private todoRepo: TodoRepository,
    @repository(ItemRepository)
    private itemRepo: ItemRepository,
  ) {}

  async list(reqBody: {
    title?: string;
    /** 分頁 0 base */
    page: number;
    pageSize: number;
  }): Promise<(Todo & TodoRelations)[]> {
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
        deleted_at: null
      },
      limit: pageSize,
      skip,
      include: [{ relation: 'items' }],
    }

    const res = await this.todoRepo.find(filter);
    
    return res;
  }

  async findById(id: number): Promise<Todo & TodoRelations> {
    const filter: Filter<Todo> = {
      where: {
        id,
        deleted_at: null,
      },
      include: [{ relation: 'items' }],
    }

    const res = await this.todoRepo.findOne(filter);

    return res;
  }

  async create(reqBody: {
    title: string;
    subtitle?: string;
    items?: {
      content: string;
    }[];
  }): Promise<Todo> {
    const newItems = reqBody.items?.map((item) => ({
      content: item.content,
      is_completed: false,
      completed_at: null,
      todo_id: newTodo.id,
    })) ?? []

    const newTodo = await this.todoRepo.create({
      title: reqBody.title,
      subtitle: reqBody.subtitle,
      status: TodoStatus.ACTIVE,
      items: newItems
    });

    return this.findById(newTodo.id)
  }

  async update(reqBody: {
      id: number;
      title?: string;
      subtitle?: string;
      status?: Exclude<TodoStatus, TodoStatus.DELETED>;
  }): Promise<Todo & TodoRelations> {
    const {
      id,
      title,
      subtitle,
      status
    } = reqBody

    const findTodo = await this.todoRepo.findOne({
      where: {
        id,
        deleted_at: null,
      }
    })

    if (!findTodo) {
      throw new HttpErrors.NotFound(`Todo ${id} not found`)
    }

    if (title) {
      findTodo.title = title;
    }

    if (subtitle) {
      findTodo.subtitle = subtitle;
    }

    if (status) {
      findTodo.status = status;
    }

    await this.todoRepo.save(findTodo)

    return this.findById(id);
  }

  async deleteById(id: number): Promise<number> {
    const findTodo = await this.todoRepo.findOne({
      where: {
        id,
        deleted_at: null,
      }
    })

    if (!findTodo) {
      throw new HttpErrors.NotFound(`Todo ${id} not found`)
    }

    findTodo.deleted_at = new Date()
    findTodo.status = TodoStatus.DELETED;

    await this.todoRepo.save(findTodo)

    return id;
  }
}
