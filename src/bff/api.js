const db = require("./db");

const {
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");

// Can only edit power stats if Superhero saved to DB
// Superhero statis to be saved to DB
// id, name, powerstats, images (1)

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getSuperhero = async (event) => {
  const response = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ superheroId: event.pathParameters.superheroId }),
    };

    const { Item } = await db.send(new GetItemCommand(params));

    console.log({ Item });

    response.body = JSON.stringify({
      message: "Successfully retirved post.",
      data: Item ? unmarshall(Item) : {},
      rawData: Item,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to get Superhero.",
      errorMsg: e.meessage,
      errorStack: e.stack,
    });
  }

  return response;
};

const createSuperhero = async (event) => {
  const response = { statusCode: 200 };

  try {
    const body = JSON.parse(event.body);

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body || {}),
    };

    const createResult = await db.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully created Superhero.",
      createResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed create Superhero.",
      errorMsg: e.meessage,
      errorStack: e.stack,
    });
  }

  return response;
};

const updateSuperhero = async (event) => {
  const response = { statusCode: 200 };

  try {
    const body = JSON.parse(event.body);

    const objKeys = Object.keys(body);

    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ postId: event.pathParameters.postId }),
        UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
        ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
            ...acc,
            [`#key${index}`]: key,
        }), {}),
        ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
            ...acc,
            [`:value${index}`]: body[key],
        }), {})),
    };

    const updateResult = await db.send(new UpdateItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully updated Superhero.",
      updateResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed update Superhero.",
      errorMsg: e.meessage,
      errorStack: e.stack,
    });
  }

  return response;
};

const deleteSuperhero = async (event) => {
  const response = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ superheroId: event.pathParameters.superheroId }),
    };

    const deleteResult = await db.send(new DeleteItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully deleted superhero.",
      deleteResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to delete superhero.",
      errorMsg: e.meessage,
      errorStack: e.stack,
    });
  }

  return response;
};

const getAllSuperheroes = async (event) => {
  const response = { statusCode: 200 };

  try {
    const { Items } = await db.send(
      new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME })
    );

    response.body = JSON.stringify({
      message: "Successfully retirved all Superheroes.",
      data: Items.map((item) => unmarshall(item)),
      Items,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to retrieve Superheroes.",
      errorMsg: e.meessage,
      errorStack: e.stack,
    });
  }

  return response;
};

module.exports = {
  getSuperhero,
  createSuperhero,
  updateSuperhero,
  deleteSuperhero,
  getAllSuperheroes,
};
