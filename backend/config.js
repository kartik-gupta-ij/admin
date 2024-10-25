require("dotenv").config();

module.exports = {
  //Port
  PORT: process.env.PORT,

  //Gmail credentials for send email
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,

  //Secret key for jwt
  JWT_SECRET: process.env.JWT_SECRET,

  //Project Name
  projectName: process.env.PROJECT_NAME,

  //baseURL
  baseURL: process.env.BASE_URL,

  //Secret key for API
  secretKey: process.env.SECRET_KEY,

  //Mongodb string
  MONGODB_CONNECTION_STRING:
    process.env.MONGODB_CONNECTION_STRING,
};
