import {
    RestExplorerBindings,
    RestExplorerComponent,
} from '@loopback/rest-explorer';

import { Loopback4ServerApplication } from './loopback-app';

export async function installOpenApi(app: Loopback4ServerApplication) {
    app.configure(RestExplorerBindings.COMPONENT).to({ path: '/documentation' });

    app.component(RestExplorerComponent);
}
