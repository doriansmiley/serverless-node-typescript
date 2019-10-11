import { APIGatewayProxyHandler, Context } from 'aws-lambda';
import 'source-map-support/register';
import * as AWSXRay from 'aws-xray-sdk';
import {Handler} from "./handlers/Handler";

export const handler: APIGatewayProxyHandler = async (event, context: Context) => {
    // Your Lambda function should do nothing but grab the payload from the incoming event
    // and invoke you handler and return a result
    // by abstracting handlers from the Lambda layer they can be distributed as part of an SDK
    // start x-ray segment
    const segment = new AWSXRay.Segment(process.env.APP_NAME);
    AWSXRay.setSegment(segment);
    try{
        // format the payload based on the event source
        // More info on types of events at https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html
        // be sure to assign the correct type to the handler constant defined above, APIGatewayProxyHandler is placeholder
        return await new Handler().invoke({data: event.body});
    } catch (e) {
        // this throw statement is suspended until finally block has completed
        throw e;
    } finally {
        segment.close();
    }
    // you can adjust the return type as needed. This return type is relevant for API Gateway integrations
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            input: event,
        }, null, 2),
    };
}
