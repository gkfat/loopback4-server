import { bootApp } from './boot/boot';
import { ApplicationConfig } from './boot/loopback-app';

export { bootApp } from './boot/boot';

export async function main(options: ApplicationConfig = {}) {
    const app = await bootApp(options);

    return app;
}

if (require.main === module) {
    const config = {
        rest: {
            port: +(process.env.PORT ?? 3000),
            host: process.env.HOST ?? '127.0.0.1',
            gracePeriodForClose: 5000,
            openApiSpec: { setServersFromRequest: true },
        },
    };

    main(config).catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
    });
}
