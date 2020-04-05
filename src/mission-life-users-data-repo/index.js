export default class MissionLifeUsersDataRepo {
  constructor(documentClient) {
    this.documentClient = documentClient;
  }

  async getSponsorshipIds(userEmail) {

    if (!userEmail || typeof userEmail !== 'string') {
      throw new TypeError(
        `MissionLifeUsersDataRepo - getSponsorShipIds - userEmail must be a string. Value Provided: ${userEmail}`
      );
    }

    const params = {
      TableName: 'MISSION_LIFE_USERS',
      KeyConditionExpression: '#email = :e',
      ExpressionAttributeNames: {
        '#email': 'EMAIL'
      },
      ExpressionAttributeValues: {
        ':e': `${userEmail}`
      }
    };

    const data = await this.documentClient.query(params).promise();

    return data.Items;
  }
}