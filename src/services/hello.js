// File: src/services/hello.js
exports.main = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello from Lambda! I will access the DynamoDB table ${process.env.TABLE_NAME}`,
            input: event,
        }),
    };
}
