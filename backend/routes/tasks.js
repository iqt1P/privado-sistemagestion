// tasks.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ruta para obtener las tareas asignadas a un usuario específico
router.get("/:userID", async (req, res) => {
  const { userID } = req.params;
  try {
    // Consulta para obtener las tareas asignadas al usuario, incluyendo el nombre del proyecto
    const tasks = await pool.query(
      `SELECT t.taskid, p.projectname, t.description AS task_description, t.status AS task_status
       FROM tasks t 
       JOIN projects p ON t.projectid = p.projectid 
       WHERE t.assignedto = $1`,
      [userID]
    );

    res.json(tasks.rows);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// Ruta para actualizar el estado de una tarea
router.post("/update-status", async (req, res) => {
  const { taskID, newStatus } = req.body;

  if (!taskID || !newStatus) {
    return res
      .status(400)
      .json({ error: "Task ID y nuevo estado son requeridos" });
  }

  try {
    // Consulta para actualizar el estado de la tarea
    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE taskid = $2 RETURNING *",
      [newStatus, taskID]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Enviar la tarea actualizada como respuesta
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar el estado de la tarea:", error);
    res.status(500).json({ error: "Error al actualizar el estado de la tarea" });
  }
});

module.exports = router;
