import {
    Client,
    createRestAppClient,
    givenHttpServerConfig,
} from '@loopback/testlab';

import { Loopback4ServerApplication } from '../../boot/loopback-app';

export async function setupApplication(): Promise<AppWithClient> {
    const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
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
