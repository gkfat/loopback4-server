import {
  Todo,
  TodoStatus,
} from 'src/models/todo.model';
import { TodoService } from 'src/services/todo.service';

import {
  api,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';

import {
  CreateTodoSchema,
  UpdateTodoSchema,
} from './todo.schema';

@api({ basePath: '/todos' })
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
  ) {}

  // 取得所有 Todo
  @get('/')
  @response(200, {
    description: 'list all todos',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Todo, {includeRelations: true}),
        },
      },
    },
  })
  async list(
    @param.query.string('title') title?: string,
    @param.query.number('page') page: number = 0,
    @param.query.number('pageSize') pageSize: number = 10,
  ) {
    const reqBody = {
      title,
      page,
      pageSize
    };

    return this.todoService.list(reqBody);
  }

  // 依 Id 取得 Todo
  @get('/{id}')
  @response(200, {
    description: 'get todo by id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ) {
    return this.todoService.findById(id);
  }

  // 新增 Todo
  @post('/create')
  @response(200, {
    description: 'create todo',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: CreateTodoSchema
        },
      },
    })
    payload: {
      title: string;
      subtitle?: string;
      items?: {
        content: string;
      }[];
    }
  ) {
    return this.todoService.create(payload);
  }

  // 更新 Todo
  @patch('/{id}')
  @response(200, {
    description: 'update todo',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  async update(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: UpdateTodoSchema
        },
      },
    })
    payload: {
      title?: string;
      subtitle?: string;
      status?: Exclude<TodoStatus, TodoStatus.DELETED>;
    }
  ) {
    return await this.todoService.update({
      id,
      ...payload
    });
  }

  // 刪除 Todo
  @del('/{id}')
  @response(200, {
    description: 'delete todo',
    content: {'application/json': {schema: Number}},
  })
  async delete(@param.path.number('id') id: number) {
    const res = await this.todoService.deleteById(id);

    return res;
  }
}
