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

// Query 1: Retrieves details about incidents, their types, and resources at the same locations.
app.get('/query1', async (req, res) => {
    const sql = `
        SELECT i.id, i.location, it.name AS incident_type, rt.name AS resource_type, r.quantity 
        FROM incidents i
        JOIN incident_type it ON i.incident_type = it.id
        JOIN resources r ON r.location = i.location
        JOIN resource_type rt ON r.resource_type = rt.id;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 2: Nested query with IN, ANY, or ALL and a GROUP BY clause
app.get('/query2', async (req, res) => {
    const sql = `
        SELECT i.incident_type, COUNT(*) AS incident_count
        FROM incidents i
        WHERE i.location IN (SELECT location FROM resources WHERE quantity > 5)
        GROUP BY i.incident_type;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 3: Correlated nested query with aliasing
app.get('/query3', async (req, res) => {
    const sql = `
        SELECT i.id, i.location, i.radius, 
               (SELECT COUNT(*) FROM resources r WHERE r.location = i.location) AS resource_count
        FROM incidents i
        WHERE i.radius > 10;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 4: Full outer join
app.get('/query4', async (req, res) => {
    const sql = `
        SELECT i.id AS incident_id, i.location AS incident_location, r.id AS resource_id, r.location AS resource_location
        FROM incidents i
        FULL OUTER JOIN resources r ON i.location = r.location;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 5: Set operation (UNION, EXCEPT, or INTERSECT)
app.get('/query5', async (req, res) => {
    const sql = `
        SELECT location FROM incidents
        INTERSECT
        SELECT location FROM resources;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 6: Custom query with two tables
app.get('/query6', async (req, res) => {
    const sql = `
        SELECT i.id, it.name AS incident_type, COUNT(r.id) AS total_resources
        FROM incidents i
        JOIN incident_type it ON i.incident_type = it.id
        LEFT JOIN resources r ON r.location = i.location
        GROUP BY i.id, it.name;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 7: Another custom query with two tables
app.get('/query7', async (req, res) => {
    const sql = `
        SELECT r.id, r.location, rt.name AS resource_type, i.id AS incident_id
        FROM resources r
        LEFT JOIN incidents i ON r.location = i.location
        JOIN resource_type rt ON r.resource_type = rt.id;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 8: Custom query using two tables with filtering
app.get('/query8', async (req, res) => {
    const sql = `
        SELECT i.id, i.location, i.radius
        FROM incidents i
        WHERE i.radius > (SELECT AVG(radius) FROM incidents);`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 9: Provide a summary of resources associated with each type of incident.
app.get('/query9', async (req, res) => {
    const sql = `
        SELECT it.name AS incident_type, COUNT(r.id) AS resources_count, AVG(r.quantity) AS avg_quantity
        FROM incident_type it
        JOIN incidents i ON it.id = i.incident_type
        JOIN resources r ON r.location = i.location
        GROUP BY it.name;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});

// Query 10: Retrieve detailed information about incidents and resources that are located at the same coordinates.
app.get('/query10', async (req, res) => {
    const sql = `
        SELECT i.id AS incident_id, r.id AS resource_id, rt.name AS resource_type, it.name AS incident_type
        FROM incidents i
        JOIN resources r ON i.location = r.location
        JOIN incident_type it ON i.incident_type = it.id
        JOIN resource_type rt ON r.resource_type = rt.id;`;
    try {
        const [results] = await dbConnection.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({ Error: err });
    }
});
// Start the Express server
app.listen(2000, () => {
    console.log("Express server is running and listening");
});
