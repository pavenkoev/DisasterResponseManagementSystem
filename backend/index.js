// backend/index.js
const express = require("express")
const cors = require("cors")
const dbConnection = require("./config")
var bodyParser = require('body-parser');
//const libraryService = require('./library_service');
//const recommendationService = require('./recommendation_service');

// Initialize the Express app
var app = express(express.json); 

app.use(cors());
app.use(bodyParser.json());

//libraryService(app, dbConnection);
//recommendationService(app, dbConnection);

// Test Route - Initial SQL Query
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

// CRUD Operations for Incident Types
app.route('/api/incident-types')
    .get((req, res) => { // Retrieve all incident types
        dbConnection.query("SELECT * FROM incident_type", (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(results);
        });
    })
    .post((req, res) => { // Create a new incident type
        const { name, color, icon } = req.body;
        dbConnection.query("INSERT INTO incident_type (name, color, icon) VALUES (?, ?, ?)", [name, color, icon], (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to create incident type" });
            res.status(201).json({ id: result.insertId, name, color, icon });
        });
    });

app.route('/api/incident-types/:id')
    .get((req, res) => { // Get incident type by id
        dbConnection.query("SELECT * FROM incident_type WHERE id = ?", [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(result[0]);
        });
    })
    .put((req, res) => { // Update incident type by id
        const { name, color, icon } = req.body;
        dbConnection.query("UPDATE incident_type SET name = ?, color = ?, icon = ? WHERE id = ?", [name, color, icon, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update incident type" });
            res.sendStatus(200);
        });
    })
    .delete((req, res) => { // Delete incident type by id
        dbConnection.query("DELETE FROM incident_type WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete incident type" });
            res.sendStatus(204);
        });
    });

// CRUD Operations for Resource Types
app.route('/api/resource-types')
    .get((req, res) => { // Retrieve all resource types
        dbConnection.query("SELECT * FROM resource_type", (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(results);
        });
    })
    .post((req, res) => { // Create a new resource type
        const { name, color, icon, description } = req.body;
        dbConnection.query("INSERT INTO resource_type (name, color, icon, description) VALUES (?, ?, ?, ?)", [name, color, icon, description], (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to create resource type" });
            res.status(201).json({ id: result.insertId, name, color, icon, description });
        });
    });

app.route('/api/resource-types/:id')
    .get((req, res) => { // Get resource type by id
        dbConnection.query("SELECT * FROM resource_type WHERE id = ?", [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(result[0]);
        });
    })
    .put((req, res) => { // Update resource type by id
        const { name, color, icon, description } = req.body;
        dbConnection.query("UPDATE resource_type SET name = ?, color = ?, icon = ?, description = ? WHERE id = ?", [name, color, icon, description, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update resource type" });
            res.sendStatus(200);
        });
    })
    .delete((req, res) => { // Delete resource type by id
        dbConnection.query("DELETE FROM resource_type WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete resource type" });
            res.sendStatus(204);
        });
    });

// CRUD Operations for Incidents
app.route('/api/incidents')
    .get((req, res) => { // Retrieve all incidents
        dbConnection.query("SELECT * FROM incidents", (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(results);
        });
    })
    .post((req, res) => { // Create a new incident
        const { location, radius, incident_type } = req.body;
        dbConnection.query("INSERT INTO incidents (location, radius, incident_type) VALUES (?, ?, ?)", [location, radius, incident_type], (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to create incident" });
            res.status(201).json({ id: result.insertId, location, radius, incident_type });
        });
    });

app.route('/api/incidents/:id')
    .get((req, res) => { // Get incident by id
        dbConnection.query("SELECT * FROM incidents WHERE id = ?", [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(result[0]);
        });
    })
    .put((req, res) => { // Update incident by id
        const { location, radius, incident_type } = req.body;
        dbConnection.query("UPDATE incidents SET location = ?, radius = ?, incident_type = ? WHERE id = ?", [location, radius, incident_type, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update incident" });
            res.sendStatus(200);
        });
    })
    .delete((req, res) => { // Delete incident by id
        dbConnection.query("DELETE FROM incidents WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete incident" });
            res.sendStatus(204);
        });
    });

// CRUD Operations for Resources
app.route('/api/resources')
    .get((req, res) => { // Retrieve all resources
        dbConnection.query("SELECT * FROM resources", (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(results);
        });
    })
    .post((req, res) => { // Create a new resource
        const { location, resource_type, quantity } = req.body;
        dbConnection.query("INSERT INTO resources (location, resource_type, quantity) VALUES (?, ?, ?)", [location, resource_type, quantity], (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to create resource" });
            res.status(201).json({ id: result.insertId, location, resource_type, quantity });
        });
    });

app.route('/api/resources/:id')
    .get((req, res) => { // Get resource by id
        dbConnection.query("SELECT * FROM resources WHERE id = ?", [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(result[0]);
        });
    })
    .put((req, res) => { // Update resource by id
        const { location, resource_type, quantity } = req.body;
        dbConnection.query("UPDATE resources SET location = ?, resource_type = ?, quantity = ? WHERE id = ?", [location, resource_type, quantity, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update resource" });
            res.sendStatus(200);
        });
    })
    .delete((req, res) => { // Delete resource by id
        dbConnection.query("DELETE FROM resources WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete resource" });
            res.sendStatus(204);
        });
    });

// Start the Express server
app.listen(2000, () => {
    console.log("Express server is running and listening");
}); 
