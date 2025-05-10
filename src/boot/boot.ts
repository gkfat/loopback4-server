import { ApplicationConfig } from '@loopback/core';

import { Loopback4ServerApplication } from './loopback-app';
import { installOpenApi } from './openapi';

export async function bootApp(config: ApplicationConfig = {}) {
    const app = new Loopback4ServerApplication(config);
    
    await app.boot();
    
    await installOpenApi(app);
    
    await app.start();

    const url = app.restServer.url;

    console.log(`Server is running at: ${url}`);
    console.log(`Documentation at: ${url}/documentation`);

    return app;
}
