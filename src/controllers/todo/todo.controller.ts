import { inject } from '@loopback/core';
import {
    api,
    del,
    get,
    param,
    patch,
    post,
    requestBody,
    response,
} from '@loopback/rest';

import { TodoStatus } from '../../enums';
import { TodoService } from '../../services/todo.service';
import { buildSchema } from '../../utils/schema';
import {
    CreateTodoRequestSchema,
    CreateTodoResponseSchema,
    DeleteTodoResponseSchema,
    GetTodoByIdResponseSchema,
    SearchTodosRequestSchema,
    SearchTodosResponseSchema,
    UpdateTodoRequestSchema,
    UpdateTodoResponseSchema,
} from './todo.schema';

@api({ basePath: '/todos' })
export class TodoController {
    constructor(
    @inject('services.TodoService')
    private readonly todoService: TodoService,
    ) {}

  // 取得所有 Todo
  @post('/search')
  @response(200, buildSchema(SearchTodosResponseSchema))
    async list(
    @requestBody(buildSchema(SearchTodosRequestSchema))
        payload: {
          title?: string;
          page?: number;
          pageSize?: number;
        }
    ) {
        const reqBody = {
            title: payload?.title,
            page: payload?.page ?? 0,
            pageSize: payload?.pageSize ?? 10,
        };

        const result = await this.todoService.list(reqBody);

        return { result };
    }

  // 依 Id 取得 Todo
  @get('/{id}')
  @response(200, buildSchema(GetTodoByIdResponseSchema))
  async findById(
    @param.path.number('id') id: number,
  ) {
      const result = await this.todoService.findById(id);

      return { result };
  }

  // 新增 Todo
  @post('/create')
  @response(200, buildSchema(CreateTodoResponseSchema))
  async create(
    @requestBody(buildSchema(CreateTodoRequestSchema))
        payload: {
          title: string;
          subtitle?: string;
          items?: {
            content: string;
            isCompleted: boolean;
          }[];
        }
  ) {
      const result = await this.todoService.create(payload);

      return { result };
  }

  // 更新 Todo
  @patch('/{id}')
  @response(200, buildSchema(UpdateTodoResponseSchema))
  async update(
    @param.path.number('id') id: number,
    @requestBody(buildSchema(UpdateTodoRequestSchema))
        payload: {
          title?: string;
          subtitle?: string;
          status?: Exclude<TodoStatus, TodoStatus.DELETED>;
        }
  ) {
      const result = await this.todoService.update({
          id,
          ...payload,
      });

      return { result };
  }

  // 刪除 Todo
  @del('/{id}')
  @response(200, buildSchema(DeleteTodoResponseSchema))
  async delete(@param.path.number('id') id: number) {
      const result = await this.todoService.deleteById(id);

      return { result };
  }
}

