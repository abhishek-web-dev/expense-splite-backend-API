//require(dotenv).config();

// 1st i have declared appConfig object
let appConfig = {};

// application is running on the server, below port 
appConfig.port = process.env.PORT;

// allowedCorsOrigin tells which type of client domain can request to this server
// here i have taken "*" means any type of client domain can request to this server
appConfig.allowedCorsOrigin = "*";

// environment tells this application is in which lebel like development,production,testing etc.
appConfig.env = "dev";

// This is localhost mongodb url to established the connection to the database
// port no on which mongodb bydefault running :27017
// Database name : expenseSplitterDB
appConfig.db = {
  uri: process.env.databaseKey
  };

// This is general way to set the API version to keep track current version of this API    
appConfig.apiVersion =process.env.apiVersion ;

// Here i am exporting all object values, this will allows us to use these object values any where in
// this API
module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db :appConfig.db,
    apiVersion : appConfig.apiVersion
};