import AWS from 'aws-sdk';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });

async function consume(event, context) {
  console.log('GOT HERE!!!');

  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ message: 'Success' })
  }
}

exports.handler = async (event, context) => {
  try {
    return await consume(event, context);
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life Sponsorship API: ${error.message}`);
  }
};