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
    const sqlIncidentsQuery = `
        SELECT i.*, it.name AS incident_type_name 
        FROM incidents i 
        JOIN incident_type it ON i.incident_type = it.id;
    `;
    const sqlResourcesQuery = `
        SELECT r.*, rt.name AS resource_type_name 
        FROM resources r 
        JOIN resource_type rt ON r.resource_type = rt.id;
    `;

    try {
        const [incidentsResults] = await dbConnection.query(sqlIncidentsQuery);
        const [resourcesResults] = await dbConnection.query(sqlResourcesQuery);

        const data = {
            incidents: incidentsResults,
            resources: resourcesResults,
        };

        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ Error: err });
    }
});

// Add a new incident
app.post('/add-incident', async (req, res) => {
    const sqlQuery = "INSERT INTO incidents (location, radius, incident_type) VALUES (ST_GeomFromText('POINT(? ?)'), ?, ?)";
    const selectQuery = `
        SELECT i.*, it.name AS incident_type_name 
        FROM incidents i 
        JOIN incident_type it ON i.incident_type = it.id 
        WHERE i.id = ?;
    `;
    const values = [req.body.location.x, req.body.location.y, req.body.radius, req.body.type];
    
    try {
        const [insertResult] = await dbConnection.query(sqlQuery, values);
        const [incident] = await dbConnection.query(selectQuery, [insertResult.insertId]);

        return res.status(200).json(incident);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ Error: err });
    }
});

// Add a new resource
app.post('/add-resource', async (req, res) => {
    const sqlQuery = "INSERT INTO resources (location, quantity, resource_type) VALUES (ST_GeomFromText('POINT(? ?)'), ?, ?)";
    const selectQuery = `
        SELECT r.*, rt.name AS resource_type_name 
        FROM resources r 
        JOIN resource_type rt ON r.resource_type = rt.id 
        WHERE r.id = ?;
    `;
    const values = [req.body.location.x, req.body.location.y, req.body.quantity, req.body.type];
    
    try {
        const [insertResult] = await dbConnection.query(sqlQuery, values);
        const [resource] = await dbConnection.query(selectQuery, [insertResult.insertId]);

        return res.status(200).json(resource);
    } catch (err) {
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
        const { name, color } = req.body;
        try {
            const [result] = await dbConnection.query(
                "INSERT INTO incident_type (name, color) VALUES (?, ?)", 
                [name, color]
            );
            res.status(201).json({ id: result.insertId, name, color });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create incident type" });
        }
    });

// Allocate a resource to an incident
app.post('/allocate-resource', async (req, res) => {
    const { incident_id, resource_id, allocated_quantity } = req.body;

    const checkAvailabilityQuery = `
        SELECT quantity 
        FROM resources 
        WHERE id = ?;
    `;
    const allocationQuery = `
        INSERT INTO incident_resource_allocation (incident_id, resource_id, allocated_quantity) 
        VALUES (?, ?, ?);
    `;
    const updateResourceQuery = `
        UPDATE resources 
        SET quantity = quantity - ? 
        WHERE id = ?;
    `;

    try {
        // Check if the resource has enough quantity
        const [resource] = await dbConnection.query(checkAvailabilityQuery, [resource_id]);

        if (!resource.length || resource[0].quantity < allocated_quantity) {
            return res.status(400).json({ error: "Insufficient resource quantity" });
        }

        // Insert allocation record and update resource quantity
        await dbConnection.query(allocationQuery, [incident_id, resource_id, allocated_quantity]);
        await dbConnection.query(updateResourceQuery, [allocated_quantity, resource_id]);

        return res.status(201).json({ message: "Resource allocated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to allocate resource" });
    }
});

// Start the Express server
app.listen(2000, () => {
    console.log("Express server is running and listening");
});
