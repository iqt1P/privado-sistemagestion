// src/pages/GenerateReports.js
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Navbar, Nav, Container, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { House, ListTask } from "react-bootstrap-icons";

const GenerateReports = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos desde el backend
        const fetchProjects = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/projects"); // Cambia la ruta según tu API
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error("Error al obtener datos de proyectos:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleExportExcel = () => {
        // Crear una hoja de trabajo desde los datos del proyecto
        const worksheet = XLSX.utils.json_to_sheet(projects);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Proyectos");

        // Exportar como archivo Excel
        XLSX.writeFile(workbook, "Reporte_Proyectos.xlsx");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login", { replace: true });
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Menú lateral con íconos */}
            <Nav className="col-md-2 d-md-block bg-light sidebar" activeKey="/generar-reportes" style={{ height: "100vh", position: "fixed", top: 0, left: 0, paddingTop: "60px", width: "200px" }}>
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
                        <i className="bi bi-file-earmark-text me-2"></i> Registro de Pruebas
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="p-3">
                    <Nav.Link href="/generar-reportes">
                        <i className="bi bi-bar-chart me-2"></i> Generar Reportes
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Contenido principal */}
            <div className="main-content" style={{ marginLeft: "200px", width: "calc(100% - 200px)" }}>
                <Navbar bg="dark" variant="dark" className="mb-4" expand="lg" style={{ width: "100%" }}>
                    <Container fluid>
                        <Navbar.Brand>Generar Reportes</Navbar.Brand>
                        <Nav className="ml-auto">
                            <Nav.Link onClick={handleLogout}>Cerrar sesión</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>

                {/* Tabla de proyectos y botón para exportar */}
                <Container>
                    <h3>Reporte de Proyectos</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre del Proyecto</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.projectID}>
                                    <td>{project.projectID}</td>
                                    <td>{project.projectname}</td>
                                    <td>{project.description}</td>
                                    <td>{project.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={handleExportExcel}>
                        Exportar a Excel
                    </Button>
                </Container>
            </div>
        </div>
    );
};

export default GenerateReports;
