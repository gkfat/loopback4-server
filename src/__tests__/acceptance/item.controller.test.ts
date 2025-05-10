import {
    Client,
    expect,
} from '@loopback/testlab';

import { Loopback4ServerApplication } from '../../boot/loopback-app';
import { ItemDto } from '../../dto';
import { setupApplication } from './test-helper';

describe('ItemController', () => {
    let app: Loopback4ServerApplication;
    let client: Client;
    let todoId: number;
    let createdItemId: number;

    before('setupApplication', async () => {
        ({
            app,
            client, 
        } = await setupApplication());

        // 建立一個 Todo 作為 Item 的父級
        const res = await client.post('/todos/create').send({
            title: 'Todo for item tests',
            items: [],
        });
  
        todoId = res.body.result.id;
    });

    after(async () => {
        await app.stop();
    });

    it('should create an Item for the Todo', async () => {
        const res = await client.post('/items/create').send({
            todoId,
            content: 'Test item',
            isCompleted: false,
        }).expect(200);
    
        const { result } = res.body;
    
        expect(result).to.have.property('id');
        expect(result.todoId).to.equal(todoId);
        expect(result.content).to.equal('Test item');

        createdItemId = result.id;
    });

    it('should fetch items of a Todo by /items/search', async () => {
        const res = await client.post('/items/search').send({ todoId }).expect(200);
    
        const { result } = res.body;
        expect(Array.isArray(result)).to.be.true();
        expect(result.some((item: ItemDto) => item.todoId === todoId)).to.be.true();
    });

    it('should get a single Item by id', async () => {
        const res = await client.get(`/items/${createdItemId}`).expect(200);

        const { result } = res.body;
        expect(result.id).to.equal(createdItemId);
        expect(result.todoId).to.equal(todoId);
    });

    it('should update an Item by id', async () => {
        const res = await client.patch(`/items/${createdItemId}`).send({
            content: 'Updated content',
            isCompleted: true,
        }).expect(200);
    
        const { result } = res.body;
        expect(result.id).to.equal(createdItemId);
        expect(result.content).to.equal('Updated content');
        expect(result.isCompleted).to.equal(true);
    });
    
    it('should delete an Item by id', async () => {
        const res = await client.del(`/items/${createdItemId}`).expect(200);
        const { result } = res.body;
        expect(result).to.equal(createdItemId);
    
        await client.get(`/items/${createdItemId}`).expect(404);
    });
});
