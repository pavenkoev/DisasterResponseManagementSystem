const express = require("express")
const cors = require("cors")
const dbConnection = require("./config")
var bodyParser = require('body-parser');
//const libraryService = require('./library_service');
//const recommendationService = require('./recommendation_service');


var app = express(express.json); 

app.use(cors());
app.use(bodyParser.json());

//libraryService(app, dbConnection);
//recommendationService(app, dbConnection);

app.get('/test', (request, response) => {
    const sqlQuery = "select * from incidents join incident_type where incidents.incident_type = incident_type.id;";
    response.setHeader('Content-Type', 'application/json');
    dbConnection.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({Error: "Error in the SQL statement. Please check."});
        }
        response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
        return response.status(200).json(result);
    });
});

app.listen(2000, () => {
    console.log("Express server is running and listening");
}); 


