export default class MissionLifeUsersDataRepo {
  constructor(documentClient) {
    this.documentClient = documentClient;
  }

  checkIfAvailable(timestamp) {
    const lastUploadDate = new Date(timestamp);

    const now = new Date();

    // To calculate the time difference of two dates
    const differenceInTime = now.getTime() - lastUploadDate.getTime();

    // To calculate the no. of days between two dates
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    console.log("THE DIFF IN DAYS: ", differenceInDays);
    return differenceInDays > 30;
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
      isAvailableForUpload[item["SPONSORSHIP_ID"]] = this.checkIfAvailable(
        item["LAST_UPLOAD_TIMESTAMP"]
      );
    }

    return {
      supporterName,
      sponsorshipIds: results,
      isAvailableForUpload,
    };
  }
}
