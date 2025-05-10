import {
    Client,
    createRestAppClient,
    givenHttpServerConfig,
} from '@loopback/testlab';

import { Loopback4ServerApplication } from '../../boot/loopback-app';

export async function setupApplication(): Promise<AppWithClient> {
    const restConfig = givenHttpServerConfig({
        port: +(process.env.PORT ?? 3000),
        host: process.env.HOST ?? '127.0.0.1',
    });

    const app = new Loopback4ServerApplication({ rest: restConfig });

    await app.boot();
    await app.start();

    const client = createRestAppClient(app);

    return {
        app, client, 
    };
}

export interface AppWithClient {
  app: Loopback4ServerApplication;
  client: Client;
}
