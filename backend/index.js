import { getDbConnection } from "./config.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Initialize the Express app
const app = express(); 

app.use(cors());
app.use(bodyParser.json());

let dbConnection;

(async () => {
    dbConnection = await getDbConnection();
})();

// Fetch all data for incidents and resources
app.get('/get-data', async (req, res) => {
    const sqlIncidentsQuery = "SELECT * FROM incidents JOIN incident_type ON incidents.incident_type = incident_type.id;";
    const sqlResourcesQuery = "SELECT * FROM resources JOIN resource_type ON resources.resource_type = resource_type.id;";

    try {
        const [incidentsResults] = await dbConnection.query(sqlIncidentsQuery);
        const [sqlResourcesResults] = await dbConnection.query(sqlResourcesQuery);

        const data = {
            incidents: incidentsResults,
            resources: sqlResourcesResults
        };

        return res.status(200).json(data);
    } catch(err) {
        console.error(err);
        return res.status(400).json({ Error: err });
    }
});

// Add a new incident
app.post('/add-incident', async (req, res) => {
    const sqlQuery = "INSERT INTO incidents (location, radius, incident_type) VALUES (ST_GeomFromText('POINT(? ?)'), ?, ?)";
    const selectQuery = "SELECT * FROM incidents JOIN incident_type ON incidents.incident_type = incident_type.id WHERE incidents.id = ?";
    const values = [req.body.location.x, req.body.location.y, req.body.radius, req.body.type];
    
    try {
        const [insertResult] = await dbConnection.query(sqlQuery, values);
        const [incident] = await dbConnection.query(selectQuery, [insertResult.insertId]);

        return res.status(200).json(incident);
    } catch(err) {
        console.error(err);
        return res.status(400).json({ Error: err });
    } 
});

// Add a new resource
app.post('/add-resource', async (req, res) => {
    const sqlQuery = "INSERT INTO resources (location, quantity, resource_type) VALUES (ST_GeomFromText('POINT(? ?)'), ?, ?)";
    const selectQuery = "SELECT * FROM resources JOIN resource_type ON resources.resource_type = resource_type.id WHERE resources.id = ?";
    const values = [req.body.location.x, req.body.location.y, req.body.quantity, req.body.type];
    
    try {
        const [insertResult] = await dbConnection.query(sqlQuery, values);
        const [resource] = await dbConnection.query(selectQuery, [insertResult.insertId]);

        return res.status(200).json(resource);
    } catch(err) {
        console.error(err);
        return res.status(400).json({ Error: err });
    } 
});

// CRUD for Incident Types
app.route('/api/incident-types')
    .get(async (req, res) => {
        try {
            const [results] = await dbConnection.query("SELECT * FROM incident_type");
            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        }
    })
    .post(async (req, res) => {
        const { name, color, icon } = req.body;
        try {
            const [result] = await dbConnection.query("INSERT INTO incident_type (name, color, icon) VALUES (?, ?, ?)", [name, color, icon]);
            res.status(201).json({ id: result.insertId, name, color, icon });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create incident type" });
        }
    });

app.route('/api/incident-types/:id')
    .get(async (req, res) => {
        try {
            const [result] = await dbConnection.query("SELECT * FROM incident_type WHERE id = ?", [req.params.id]);
            res.json(result[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        }
    })
    .put(async (req, res) => {
        const { name, color, icon } = req.body;
        try {
            await dbConnection.query("UPDATE incident_type SET name = ?, color = ?, icon = ? WHERE id = ?", [name, color, icon, req.params.id]);
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update incident type" });
        }
    })
    .delete(async (req, res) => {
        try {
            await dbConnection.query("DELETE FROM incident_type WHERE id = ?", [req.params.id]);
            res.sendStatus(204);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete incident type" });
        }
    });

// CRUD for Resource Types
app.route('/api/resource-types')
    .get(async (req, res) => {
        try {
            const [results] = await dbConnection.query("SELECT * FROM resource_type");
            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        }
    })
    .post(async (req, res) => {
        const { name, color, icon, description } = req.body;
        try {
            const [result] = await dbConnection.query("INSERT INTO resource_type (name, color, icon, description) VALUES (?, ?, ?, ?)", [name, color, icon, description]);
            res.status(201).json({ id: result.insertId, name, color, icon, description });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create resource type" });
        }
    });

// More CRUD routes as previously defined would continue here...

// Start the Express server
app.listen(2000, () => {
    console.log("Express server is running and listening");
});
