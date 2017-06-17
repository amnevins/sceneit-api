import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

AWS.config.update({region:'us-east-1'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: 'movie_friends',
        Item: {
            userId: event.requestContext.authorizer.claims.sub,
            userPicture: data.Picture,
            userName: data.userName,
            friendId: data.friendId,
            friendPicture: data.friendPicture,
            friendName: data.friendName,
            friendshipId: uuid.v1(),
            reciprocated: false,
            createdAt: new Date().getTime(),
        },
    };

    try {
        const result = await dynamoDbLib.call('put', params);
        callback(null, success(params.Item));
    }
    catch(e) {
        callback(null, failure({status: false}));
    }
};
