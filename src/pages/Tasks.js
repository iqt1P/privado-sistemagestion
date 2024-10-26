import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { House, ListTask } from "react-bootstrap-icons";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskID, setSelectedTaskID] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userNameFromStorage = localStorage.getItem("name");
    const userIDFromStorage = localStorage.getItem("userID");

    if (!userIDFromStorage) {
      navigate("/login", { replace: true });
      return;
    }

    setUserName(userNameFromStorage);

    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${userIDFromStorage}`);
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error al obtener tareas:", err);
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleShowModal = (taskID) => {
    setSelectedTaskID(taskID);
    setNewStatus("");
    setShowModal(true);
    localStorage.setItem("selectedTaskID", taskID); // Guardamos el taskID en localStorage
  };

  const handleChangeStatus = async () => {
    const taskIDFromStorage = localStorage.getItem("selectedTaskID");

    if (!newStatus || !taskIDFromStorage) {
      setErrorMessage("Task ID y nuevo estado son requeridos");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tasks/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskID: taskIDFromStorage, newStatus }),
      });

      if (response.ok) {
        alert("Estado de la tarea actualizado");
        setShowModal(false);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskid.toString() === taskIDFromStorage
              ? { ...task, task_status: newStatus }
              : task
          )
        );
      } else {
        setErrorMessage("Error al actualizar el estado. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
      setErrorMessage("Ocurrió un error al intentar cambiar el estado.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Nav
        className="col-md-2 d-md-block bg-light sidebar"
        activeKey="/tasks"
        style={{
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          paddingTop: "60px",
          width: "200px",
        }}
      >
        <div className="sidebar-sticky"></div>
        <Nav.Item className="p-3">
          <Nav.Link href="/dashboard">
            <House className="me-2" /> Proyectos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="p-3">
          <Nav.Link href="/tasks">
            <ListTask className="me-2" /> Tareas
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="main-content" style={{ marginLeft: "200px", width: "calc(100% - 200px)" }}>
        <Navbar bg="dark" variant="dark" className="mb-4" expand="lg" style={{ width: "100%" }}>
          <Container fluid>
            <Navbar.Brand>Bienvenido, {userName}</Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link href="/perfil">Perfil</Nav.Link>
              <Nav.Link onClick={() => navigate("/login", { replace: true })}>Cerrar sesión</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Container>
          <h3>Tareas Asignadas</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID de la Tarea</th>
                <th>Nombre del Proyecto</th>
                <th>Descripción de la Tarea</th>
                <th>Estado</th>
                <th>Cambiar Estado</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.taskid}>
                    <td>{task.taskid}</td>
                    <td>{task.projectname}</td>
                    <td>{task.task_description}</td>
                    <td>{task.task_status}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleShowModal(task.taskid)}>
                        Cambiar Estado
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No tienes tareas asignadas.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cambiar estado de la tarea</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Selecciona el nuevo estado:</Form.Label>
              <Form.Control as="select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="">Selecciona un estado</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleChangeStatus}>
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Tasks;
