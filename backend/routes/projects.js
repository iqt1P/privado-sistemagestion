// projects.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ruta para obtener los proyectos asignados a un usuario específico
router.get("/:userID", async (req, res) => {
    const { userID } = req.params;
    try {
        // Consulta para obtener los proyectos asignados al usuario
        const projects = await pool.query(
            "SELECT projectid, projectname, description, status FROM projects WHERE assignedto = $1",
            [userID]
        );
        // Enviar la lista de proyectos como respuesta
        res.json(projects.rows);
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        res.status(500).json({ error: "Error al obtener proyectos" });
    }
});

// Ruta para actualizar el estado de un proyecto
router.post("/update-status", async (req, res) => {
    const { projectID, newStatus } = req.body;

    if (!projectID || !newStatus) {
        return res.status(400).json({ error: "Project ID y nuevo estado son requeridos" });
    }

    try {
        // Consulta para actualizar el estado del proyecto
        const result = await pool.query(
            "UPDATE projects SET status = $1 WHERE projectid = $2 RETURNING *",
            [newStatus, projectID]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }

        // Enviar el proyecto actualizado como respuesta
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al actualizar el estado del proyecto:", error);
        res.status(500).json({ error: "Error al actualizar el estado del proyecto" });
    }
});

module.exports = router;
