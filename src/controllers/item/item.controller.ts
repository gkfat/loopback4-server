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

import { ItemService } from '../../services/item.service';
import { buildSchema } from '../../utils/schema';
import {
    CreateItemRequestSchema,
    CreateItemResponseSchema,
    DeleteItemResponseSchema,
    GetItemByIdResponseSchema,
    SearchItemsByTodoRequestSchema,
    SearchItemsByTodoResponseSchema,
    UpdateItemRequestSchema,
    UpdateItemResponseSchema,
} from './item.schema';

@api({ basePath: '/items' })
export class ItemController {
    constructor(
    @inject('services.ItemService')
    private readonly itemService: ItemService,
    ) {}

  // 取得某 Todo 下所有 items
  @post('/search')
  @response(200, buildSchema(SearchItemsByTodoResponseSchema))
    async searchItemsByTodoId(
     @requestBody(buildSchema(SearchItemsByTodoRequestSchema))
         payload: {
        todoId: number;
        content?: string;
        isCompleted?: boolean;
        page?: number;
        pageSize?: number;
      }
    ) {
        const reqBody = {
            todoId: payload.todoId,
            content: payload.content,
            isCompleted: payload.isCompleted,
            page: payload.page ?? 0,
            pageSize: payload.pageSize ?? 10,
        };

        const result = await this.itemService.searchByTodoId(reqBody);

        return { result };
    }

  // 依 Id 取得 Item
  @get('/{id}')
  @response(200, buildSchema(GetItemByIdResponseSchema))
  async findById(
    @param.path.number('id') id: number,
  ) {
      const result = await this.itemService.findById(id);

      return { result };
  }

  // 新增 Item
  @post('/create')
  @response(200, buildSchema(CreateItemResponseSchema))
  async create(
    @requestBody(buildSchema(CreateItemRequestSchema))
        payload: {
      todoId: number;
      content: string;
      isCompleted: boolean;
    }
  ) {
      const result = await this.itemService.create(payload);

      return { result };
  }

  // 更新 Item
  @patch('/{id}')
  @response(200, buildSchema(UpdateItemResponseSchema))
  async update(
    @param.path.number('id') id: number,
    @requestBody(buildSchema(UpdateItemRequestSchema))
        payload: {
      content?: string;
      isCompleted?: boolean;
      completedAt?: string;
    }
  ) {
      const result = await this.itemService.update({
          id,
          ...payload,
      });

      return { result };
  }

  // 刪除 Item
  @del('/{id}')
  @response(200, buildSchema(DeleteItemResponseSchema))
  async delete(@param.path.number('id') id: number) {
      const result = await this.itemService.deleteById(id);

      return { result };
  }
}

