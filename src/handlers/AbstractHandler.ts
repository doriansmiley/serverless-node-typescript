import * as AWSXRay from 'aws-xray-sdk';
// debug is a hierarchical logging tool, for more info see https://www.npmjs.com/package/debug
import * as Debug from 'debug';

const debug = Debug(process.env.APP_NAME);
import {object, validate, ValidationOptions, ValidationResult as JoiValidationResult} from 'joi';

export enum LogLevels {
    LOG = 'LOG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}


export abstract class AbstractHandler {

    // you can override invoke in a subclass to adjust the return type
    public async invoke(event): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            // add X-Ray telemetry passing the subsegment
            AWSXRay.captureAsyncFunc(this.getSegmentName(),
                async (subsegment) => {
                    try {
                        const result = await this.processRequest(event);
                        resolve(result);
                    } catch (e) {
                        this.log(LogLevels.ERROR, e.message, event, e);
                        reject(e);
                    } finally {
                        // TODO figure out why this fails in local testing. subsegment is undefined, and so is AWSXRay.getSegment()
                        subsegment.close();
                    }

                });
        });
    }

    protected async processRequest(event): Promise<any> {
        // to open a subsegment for x-ray call AWSXRay.captureAsyncFunc
        // you'll have to promisfy the call or wrap in a promise like invoke
        // log request received
        this.log(LogLevels.INFO, this.getSegmentName() + ' Request received', event);
        try {
            // first validate the incoming request.
            this.checkValidation(event);

            // stub for override
            // in your sub classes you should supply value for result and error
            return null;
        } catch (e) {
            // log error response
            this.log(LogLevels.ERROR, e.message, null, e);
            throw e;
        }
    }

    // override in subclasses
    protected getSegmentName(): string {
        return 'AbstractController';
    }

    protected checkValidation(event): void {
        // first validate the incoming request
        const vResult = this.validate(event);
        if (vResult.error !== null) {
            const error = new Error(vResult.error.message);
            this.log(LogLevels.ERROR, vResult.error.message, null, error);
            throw error;
        }
        return null;
    }

    // validate the payload
    protected validate(event): JoiValidationResult<object> {
        const schema: object = this.getSchema();
        const options: ValidationOptions = this.getOptions();
        return validate<object>(this.getValidationObject(event), schema, options);
    }

    // can be overriden in subclasses depending on the type of event.
    protected getValidationObject(event): object {
        return event.data;
    }

    // joi validation options
    protected getOptions(): ValidationOptions {
        return {
            allowUnknown: true
        };
    }

    // stub for override in subclasses based on the type of data expected
    protected getSchema(): object {
        return object({});
    }

    protected log(level: LogLevels, message: string, data: object = null, error: Error = null): void {
        debug({
            logLevel: level,
            message: message,
            data: data,
            error: error,
        });
    }
}
