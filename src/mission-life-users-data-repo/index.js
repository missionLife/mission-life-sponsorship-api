export default class MissionLifeUsersDataRepo {
  constructor(documentClient) {
    this.documentClient = documentClient;
  }

  getDiffinDays(timestamp) {
    const lastUploadDate = new Date(timestamp);
    lastUploadDate.setHours(0,0,0,0);

    const now = new Date();
    now.setHours(0,0,0,0);

    // To calculate the time difference of two dates
    const differenceInTime = now.getTime() - lastUploadDate.getTime();
    // To calculate the no. of days between two dates
    return (differenceInTime / (1000 * 3600 * 24));
  }

  getNextUploadDate(timestamp) {
    const lastUploadDate = new Date(timestamp);
    return lastUploadDate.setDate(lastUploadDate.getDate() + 30);
  }

  checkIfAvailable(timestamp) {
    return this.getDiffinDays(timestamp) >= 30;
  }

  async getSponsorshipIds(userEmail) {
    if (!userEmail || typeof userEmail !== "string") {
      throw new TypeError(
        `MissionLifeUsersDataRepo - getSponsorShipIds - userEmail must be a string. Value Provided: ${userEmail}`
      );
    }

    const params = {
      TableName: "MISSION_LIFE_USERS",
      KeyConditionExpression: "#email = :e",
      ExpressionAttributeNames: {
        "#email": "EMAIL",
      },
      ExpressionAttributeValues: {
        ":e": `${userEmail}`,
      },
    };

    const data = await this.documentClient.query(params).promise();

    const results = [];
    const isAvailableForUpload = {};
    let supporterName;

    for (const item of data.Items) {
      if (!supporterName && item["NAME"]) {
        supporterName = item["NAME"];
      }
      results.push(item["SPONSORSHIP_ID"]);
      isAvailableForUpload[item["SPONSORSHIP_ID"]] = {
        isAvailable: this.checkIfAvailable(
          item["LAST_UPLOAD_TIMESTAMP"]
        ),
        dateAvailableForUpload: this.getNextUploadDate(item["LAST_UPLOAD_TIMESTAMP"])
      }
    }

    return {
      supporterName,
      sponsorshipIds: results,
      isAvailableForUpload,
    };
  }
}
