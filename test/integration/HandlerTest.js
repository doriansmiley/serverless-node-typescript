'use strict';
const AWS = require('aws-sdk');

describe('Testing Handler', function() {
    const host = process.env.API_GATEWAY_HOST;
    const port = process.env.API_GATEWAY_PORT;
    const protocol = process.env.LOCAL_TESTING === '0' ? 'https:' : 'http:';
    const lambda = new AWS.Lambda({
        apiVersion: '2015-03-31',
        region: 'us-east-1',
        endpoint: process.env.LOCAL_TESTING ? protocol + '//' + host + ':' + port : undefined,
    });
    console.log(protocol + '//' + host + ':' + port);
    it('should return success response 200', function(done) {
        // TODO: replace body with your test payload
        const body = {name: 'Vader', address: 'Death Star', publicKey: 'Sith', privateKey: 'Lord'};
        const lambdaInvokeParameters = {
            FunctionName: 'serverless-node-typescript-'+process.env.STAGE+'-Handler',
            InvocationType: 'Event',
            LogType: 'None',
            Payload: JSON.stringify(body),
        }
        lambda.invoke(lambdaInvokeParameters).send((err, result)=>{
            if(err) {
                return done(err);
            }
            // TODO: add your assertions, by default handler returns the event you send it
            // serverless appends "isOffline":true,"stageVariables":{} to the result
            expect(result.Payload).to.deep.equal('{"name":"Vader","address":"Death Star","publicKey":"Sith","privateKey":"Lord","isOffline":true,"stageVariables":{}}');
            done()
        });
    }).timeout(25000);
});
