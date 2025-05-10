import {
  BindingScope,
  injectable,
} from '@loopback/core';
import {
  Filter,
  repository,
} from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';

import { toTodoDto } from '../dto/todo.dto';
import {
  Todo,
  TodoStatus,
} from '../models/todo.model';
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
        deletedAt: {
          eq: null
        }
      },
      limit: pageSize,
      skip,
      include: [{ relation: 'items' }],
    }

    const res = await this.todoRepo.find(filter);
    
    return res.map(toTodoDto);
  }

  async findById(id: number) {
    const filter: Filter<Todo> = {
      where: {
        id,
        deletedAt: {
          eq: null
        }
      },
      include: [{ relation: 'items' }],
    }

    const res = await this.todoRepo.findOne(filter);

    return res ? toTodoDto(res) : null;
  }

  async create(reqBody: {
    title: string;
    subtitle?: string;
    items?: {
      content: string;
    }[];
  }) {
    const newTodo = await this.todoRepo.create({
      title: reqBody.title,
      subtitle: reqBody.subtitle,
      status: TodoStatus.ACTIVE,
    });

    if (reqBody.items?.length) {
      await Promise.all(
        reqBody.items?.map((item) => this.todoRepo.items(newTodo.id).create({
            content: item.content,
            isCompleted: false,
            todoId: newTodo.id,
        }))
      )
    }

    return this.findById(newTodo.id)
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
      status
    } = reqBody

    const findTodo = await this.todoRepo.findOne({
      where: {
        id,
        deletedAt: {
          eq: null
        }
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

  async deleteById(id: number) {
    const findTodo = await this.todoRepo.findOne({
      where: {
        id,
        deletedAt: {
          eq: null
        }
      }
    })

    if (!findTodo) {
      throw new HttpErrors.NotFound(`Todo ${id} not found`)
    }

    findTodo.deletedAt = new Date()
    findTodo.status = TodoStatus.DELETED;

    await this.todoRepo.save(findTodo)

    return id;
  }
}
