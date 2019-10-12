# serverless-node-typescript
Serverless template for Lambda using eslint, webpack, and TypeScript

# What's Included

# Getting Started
```
$ sls install -url https://github.com/doriansmiley/serverless-node-typescript --name my-new-service
sls create --name my-new-service
````
This will create a new project in your working directory. Once installed the project sets up a single Lambda function with no event sources.
- Edit `src/Handler.ts` by adding your function and validation logic. `joi` is used to perform validation logic.
- Edit `index.ts` to adjust your return object format
- You should not need to edit `AbstractHandler` at all.

### Build
`npm run build`

### Test
`npm test`

### Deploy

