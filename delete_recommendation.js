import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
    const params = {
        TableName: 'movie_recommendations',
        // 'Key' defines the partition key and sort key of the item to be removed
        // - 'userId': User Pool sub of the authenticated user
        // - 'noteId': path parameter
        Key: {
            friendId: event.requestContext.authorizer.claims.sub,
            recommendationId: event.pathParameters.id,
        },
    };

    try {
        const result = await dynamoDbLib.call('delete', params);
        callback(null, success({status: true}));
    }
    catch(e) {
        callback(null, failure({status: false}));
    }
};
