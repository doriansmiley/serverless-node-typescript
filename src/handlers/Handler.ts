import {AbstractHandler} from "./AbstractHandler";
import {object} from 'joi';

export class Handler extends AbstractHandler {
    protected async processRequest(event): Promise<any> {
        await super.processRequest(event);
        // TODO: add you code here
        return event;
    }

    // add you joi schema validation here
    protected getSchema(): object {
        return object({});
    }
}
