// Dashboard.js

import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { House, ListTask } from "react-bootstrap-icons";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
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

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${userIDFromStorage}`
        );
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error al obtener proyectos:", err);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleShowModal = (projectID) => {
    setSelectedProjectID(projectID);
    setNewStatus("");
    setShowModal(true);
  };

  const handleChangeStatus = async () => {
    if (!newStatus || !selectedProjectID) {
      setErrorMessage("Project ID y nuevo estado son requeridos");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/projects/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectID: selectedProjectID, newStatus }),
        }
      );

      if (response.ok) {
        alert("Estado del proyecto actualizado");
        setShowModal(false);
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.projectid === selectedProjectID
              ? { ...project, status: newStatus }
              : project
          )
        );
      } else {
        setErrorMessage("Error al actualizar el estado. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al cambiar el estado del proyecto:", error);
      setErrorMessage("Ocurrió un error al intentar cambiar el estado.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Nav
        className="col-md-2 d-md-block bg-light sidebar"
        activeKey="/dashboard"
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
        <Nav.Item className="p-3">
          <Nav.Link href="/registro-pruebas">
            <i className="bi bi-file-earmark-text me-2"></i> Registro de pruebas
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="p-3">
          <Nav.Link href="/generar-reportes">
            <i className="bi bi-bar-chart me-2"></i> Generar Reportes
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div
        className="main-content"
        style={{ marginLeft: "200px", width: "calc(100% - 200px)" }}
      >
        <Navbar
          bg="dark"
          variant="dark"
          className="mb-4"
          expand="lg"
          style={{ width: "100%" }}
        >
          <Container fluid>
            <Navbar.Brand>Bienvenido, {userName}</Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link href="/perfil">Perfil</Nav.Link>
              <Nav.Link onClick={handleLogout}>Cerrar sesión</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Container>
          <h3>Proyectos Asignados</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID del Proyecto</th>
                <th>Nombre del Proyecto</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Cambiar Estado</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.projectid}>
                    <td>{project.projectid}</td>
                    <td>{project.projectname}</td>
                    <td>{project.description}</td>
                    <td>{project.status}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleShowModal(project.projectid)}
                      >
                        Cambiar Estado
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No tienes proyectos asignados.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cambiar estado del proyecto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Selecciona el nuevo estado:</Form.Label>
              <Form.Control
                as="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
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

export default Dashboard;
