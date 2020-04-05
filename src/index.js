import AWS from 'aws-sdk';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

async function getUserFromToken(event, context) {
  console.log('GOT HERE THE EVENT!!!', event);
  console.log('GOT HERE THE TOKEN!!!', event.headers.Authorization);

  try {
    const user = await cognitoIdentityServiceProvider.getUser({
      AccessToken: event.headers.Authorization
    }).promise();
  
    console.log('########### THE USER!!!!!!', user);

    return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Success' })
    }  
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.handler = async (event, context) => {
  try {
    return await getUserFromToken(event, context);
  } catch (error) {
    const messageObject = {
      message: `An error occurred in the Mission Life Sponsorship API: ${error.message}`
    };

    return {
      statusCode: 500,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(messageObject)
    } 
  }
};