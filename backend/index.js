import { getDbConnection } from "./config.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


var app = express(express.json); 

app.use(cors());
app.use(bodyParser.json());

let dbConnection;

(async () => {
    dbConnection = await getDbConnection();
})();


app.get('/get-data', async (request, response) => {
    const sqlIncidentsQuery = "select * from incidents join incident_type where incidents.incident_type = incident_type.id;";
    const sqlResourcesQuery = "SELECT * FROM `resources` join resource_type on resources.resource_type = resource_type.id;";

    try {
        const [incidentsResults] = await dbConnection.query(sqlIncidentsQuery);
        const [sqlResourcesResults] = await dbConnection.query(sqlIncidentsQuery);

        let data = {
            incidents: incidentsResults,
            resources: sqlResourcesResults
        };

        return response.status(200).json(data);
    } catch(err) {
        console.error(err);
        return response.status(400).json({Error: err});
    }
});


app.post('/add-incident', async (request, response) => {
    console.log(request);

    const sqlQuery = "insert into incidents (`location`, `radius`, `incident_type`) values " +
    "(ST_GeomFromText('POINT(? ?)'), ?, ?)";
    const selectQuery = "SELECT * FROM `incidents` join incident_type on incidents.incident_type = incident_type.id where incidents.id = ?;";

    const values = [request.body.location.x, request.body.location.y, request.body.radius, request.body.type];
    
    try {
        const [insertResult] = await dbConnection.query(sqlQuery, values);
        const [incident] = await dbConnection.query(selectQuery, [insertResult.insertId]);

        return response.status(200).json(incident);
    } catch(err) {
        console.error(err);
        return response.status(400).json({Error: err});
    } 
});

app.post('/add-resource', async (request, response) => {
    console.log(request);

    const sqlQuery = "insert into resources (`location`, `quantity`, `resource_type`) values " +
    "(ST_GeomFromText('POINT(? ?)'), ?, ?)";
    const selectQuery = "SELECT * FROM `resources` join resource_type on resources.resource_type = resource_type.id where resources.id = ?;";

    const values = [request.body.location.x, request.body.location.y, request.body.quantity, request.body.type];
    
    try {
        const [insertResult] = await dbConnection.query(sqlQuery, values);
        const [resource] = await dbConnection.query(selectQuery, [insertResult.insertId]);

        return response.status(200).json(resource);
    } catch(err) {
        console.error(err);
        return response.status(400).json({Error: err});
    } 
});


app.listen(2000, () => {
    console.log("Express server is running and listening");
}); 


