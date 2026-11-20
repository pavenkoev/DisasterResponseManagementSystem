# Disaster Response Management System (DRMS)

A map-based tool for coordinating emergency response. Responders plot incidents (fires, floods and so on)
and available resources (shelters, medical teams, supplies) on an interactive map, link resources to
incidents, and run spatial queries to see what's covered and what's missing.

**Stack:** React 18 + Vite · Leaflet / react-leaflet · Node.js + Express · MySQL 8 spatial types

## What it does

- **Interactive map:** click to place incidents (with a radius) and resources (with a quantity). Markers are colored and iconed by type.
- **Assign resources:** connect resources to incidents and remove them again.
- **Custom types:** define new incident and resource types (name, color, icon) from the UI.
- **Analysis views:**
  1. **Resource coverage per incident:** compares the resources each incident type requires against what's assigned, and flags gaps.
  2. **Connection counts:** incidents and resources with at least N links, to spot over- or under-served locations.
  3. **Resources within a radius:** every resource within X meters of an incident, nearest first, using `ST_Distance_Sphere`.
  4. **Incidents active on a date:** incidents whose start/end window covers the chosen day.

## Data model

Six tables in [`drms.sql`](drms.sql): `incidents` and `resources` (each with a MySQL `POINT` location),
`incident_type`, `resource_type`, the many-to-many `incident_resources`, and `incident_type_resources`
(how much of each resource type an incident type needs). Distance queries run in the database instead of in JavaScript.

## Run it locally

**Requirements:** Node 18+, MySQL 8.

```bash
# 1. Database
mysql -u root -p < drms.sql

# 2. API (http://localhost:2000)
cd backend
npm install
MYSQLHOST=localhost MYSQLUSER=<user> MYSQLPASSWORD=<password> MYSQLDATABASE=drms MYSQLPORT=3306 npm start

# 3. Frontend (http://localhost:5173)
cd ../frontend
npm install
npm run dev
```

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/get-data` | incidents, resources and links in one call |
| POST | `/add-incident`, `/add-resource` | create a point on the map |
| GET/DELETE | `/api/incidents/:id`, `/api/resources/:id` | read or remove one |
| POST/DELETE | `/api/connection` | link or unlink a resource and an incident |
| GET/POST/PUT/DELETE | `/api/incident-types`, `/api/resource-types` | manage types |
| GET | `/api/incident-resource-analysis/:id` | coverage analysis (view 1) |
| POST | `/api/entity-connection-num` | connection counts (view 2) |
| POST | `/api/incident-resouces-in-radius` | radius search (view 3) |
| POST | `/api/incident-by-date` | active incidents (view 4) |

## Project layout

```text
backend/    Express API (index.js) and MySQL connection (config.js)
frontend/   React app: Map.jsx (Leaflet map), Query1–4.jsx (analysis views), Forms/ (type editors)
drms.sql    schema and seed data
```
