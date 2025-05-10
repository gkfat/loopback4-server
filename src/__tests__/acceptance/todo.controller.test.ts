import {
    Client,
    expect,
} from '@loopback/testlab';

import { Loopback4ServerApplication } from '../../boot/loopback-app';
import { TodoDto } from '../../dto';
import { setupApplication } from './test-helper';

describe('TodoController', () => {
    let app: Loopback4ServerApplication;
    let client: Client;
    let createdTodo: TodoDto;

    before('setupApplication', async () => {
        ({
            app,
            client, 
        } = await setupApplication());
    });

    after(async () => {
        await app.stop();
    });

    it('should create Todo', async () => {
        const res = await client.post('/todos/create').send({
            title: 'Test Todo',
            subtitle: 'test todo subtitle',
            items: [
                {
                    content: 'First item',
                    isCompleted: false,
                }, {
                    content: 'Second item',
                    isCompleted: false,
                },
            ],
        }).expect(200);
    
        const { result } = res.body as { result: TodoDto };
        createdTodo = result;

        expect(result).to.have.property('id');
        expect(result.title).to.equal('Test Todo');
        expect(result.items).to.have.length(2);
    });

    it('should get todos with relations', async () => {
        const res = await client.post('/todos/search').expect(200);

        const { result } = res.body as { result: TodoDto[] };

        expect(Array.isArray(result)).to.be.true();

        result.every((todo) => expect(todo).to.have.property('items'));
    });

    it('should get a Todo by id with items', async () => {
        const res = await client.get(`/todos/${createdTodo.id}`).expect(200);
        const { result } = res.body as { result: TodoDto };
    
        expect(result.id).to.equal(createdTodo.id);
        expect(result.title).to.equal('Test Todo');
       
        expect(result.items).to.have.length(2);
    });

    it('should update a Todo title and subtitle', async () => {
        const updated = await client.patch(`/todos/${createdTodo.id}`).send({
            title: 'Updated Todo Title',
            subtitle: 'Updated subtitle',
        }).expect(200);

        const { result } = updated.body as { result: TodoDto };
        expect(result.title).to.equal('Updated Todo Title');
        expect(result.subtitle).to.equal('Updated subtitle');
    });

    it('should soft-delete a Todo by id', async () => {
        const deleted = await client.del(`/todos/${createdTodo.id}`).expect(200);
        expect(deleted.body.result as TodoDto).to.equal(createdTodo.id);

        // Expect it to not appear in list
        const res = await client.post('/todos/search').send({}).expect(200);
        const { result } = res.body as { result: TodoDto[] };
        const found = result.find(t => t.id === createdTodo.id);
        expect(found).to.be.undefined();

        // Optionally check if status is DELETED
        const deletedData = await client.get(`/todos/${createdTodo.id}`).expect(200);
        expect(deletedData.body.result).to.be.null();
    });
});
