import AWS from 'aws-sdk';
import ReachService from './reach-service';
import MissionLifeUsersDataRepo from './mission-life-users-data-repo';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });

const documentClient = new AWS.DynamoDB.DocumentClient();
const missionLifeUsersDataRepo = new MissionLifeUsersDataRepo(documentClient);

function getUserFromEvent(event) {
  return event.requestContext.authorizer.claims.email;
}

async function getSponsorships(event, context) {

  try {
    const userEmail = getUserFromEvent(event);
    console.log('########### THE USER!!!!!!', userEmail);

    const sponsorshipIds = await missionLifeUsersDataRepo.getSponsorshipIds(userEmail);
    console.log('########### THE DYNAMO RESPONSE!!!!!!', sponsorshipIds);

    const sponsorships = await ReachService.getSponsorships(sponsorshipIds);
    console.log('########### THE REACH RESPONSE!!!!!!', sponsorships);
    return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ sponsorships })
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