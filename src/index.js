import AWS from 'aws-sdk';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });


function getUserFromEvent(event) {
  return event.requestContext.authorizer.claims.email;
}
async function getSponsorships(event, context) {

  const userEmail = getUserFromEvent(event);

  // TODO CALL DYNAMO

  // TODO CALL REACH

  // Return Sponsorships
  try {
    console.log('########### THE USER!!!!!!', userEmail);

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
    return await getSponsorships(event, context);
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