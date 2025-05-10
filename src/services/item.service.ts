import {
    BindingScope,
    injectable,
} from '@loopback/core';
import {
    Filter,
    repository,
} from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';

import { toItemDto } from '../dto/';
import { Item } from '../models';
import { ItemRepository } from '../repositories';
import { isDefined } from '../utils/common';

@injectable({ scope: BindingScope.TRANSIENT })
export class ItemService {
    constructor(
    @repository(ItemRepository)
        private itemRepo: ItemRepository,
    ) {}

    async searchByTodoId(reqBody: {
      todoId: number;
      content?: string;
      isCompleted?: boolean;
      page: number;
      pageSize: number;
  }) {
        const {
            todoId,
            content,
            isCompleted,
            page,
            pageSize,
        } = reqBody;

        const skip = (page) * pageSize;

        const filter: Filter<Item> = {
            where: {
                todoId,
                ...(
                    isDefined(content)
                        ? { content: { like: `%${content}%` } }
                        : {}
                ),
                ...(
                    isDefined(isCompleted)
                        ? { isCompleted }
                        : {}
                ),
            },
            limit: pageSize,
            skip,
        };

        const res = await this.itemRepo.find(filter);
    
        return res.map(toItemDto);
    }

    async findById(id: number) {
        const res = await this.itemRepo.findById(id);

        return res ? toItemDto(res) : null;
    }

    async create(reqBody: {
    todoId: number;
    content: string;
    isCompleted: boolean;
  }) {
        const {
            todoId,
            content,
            isCompleted,
        } = reqBody;

        const newItem = await this.itemRepo.create({
            todoId,
            content,
            isCompleted,
        });

        return this.findById(newItem.id);
    }

    async update(reqBody: {
      id: number;
      content?: string;
      isCompleted?: boolean;
      completedAt?: string;
  }) {
        const {
            id,
            content,
            isCompleted,
            completedAt,
        } = reqBody;

        const findItem = await this.itemRepo.findById(id);

        if (!findItem) {
            throw new HttpErrors.NotFound(`Item ${id} not found`);
        }

        if (isDefined(content)) {
            findItem.content = content;
        }

        if (isDefined(isCompleted)) {
            findItem.isCompleted = isCompleted;
        }

        if (isDefined(completedAt)) {
            findItem.completedAt = new Date(completedAt);
        }

        await this.itemRepo.save(findItem);

        return this.findById(id);
    }

    async deleteById(id: number) {
        const findItem = await this.itemRepo.findById(id);

        if (!findItem) {
            throw new HttpErrors.NotFound(`Todo ${id} not found`);
        }

        await this.itemRepo.deleteById(id);
    
        return id;
    }
}
