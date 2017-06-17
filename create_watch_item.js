import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

import AWS from 'aws-sdk';
AWS.config.update({region:'us-east-1'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: 'movie_watchlist',
        Item: {
            userId: event.requestContext.authorizer.claims.sub,
            watchItemId: uuid.v1(),
            movieId: data.movieId,
            recommendedId: data.recommendedId,
            rating: data.rating,
            createdAt: new Date().getTime(),
        },
    };
    console.log(params.TableName);
    console.log(params.Item);

    try {
        const result = await dynamoDbLib.call('put', params);
        console.log(result);
        callback(null, success(params.Item));
    }
    catch(e) {
        console.log(e);
        callback(null, failure({status: false}));
    }
};
