import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Datos de respuesta de la API:", data); // Verifica los datos devueltos por la API

            if (response.ok && data.userID && data.name && data.email && data.role) {
                // Guardar todos los datos en localStorage
                localStorage.setItem("userID", data.userID);
                localStorage.setItem("name", data.name);
                localStorage.setItem("email", data.email);
                localStorage.setItem("role", data.role);
                
                navigate("/dashboard");
            } else {
                setErrorMessage("Credenciales incorrectas o datos incompletos en la respuesta.");
            }
        } catch (err) {
            console.error("Error de red:", err); 
            setErrorMessage("Error de red. Intente nuevamente.");
        }
    };

    return (
        <section className="h-100 gradient-form" style={{ backgroundColor: "#eee" }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0">
                                <div className="col-lg-6">
                                    <div className="card-body p-md-5 mx-md-4">
                                        <div className="text-center">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                                                style={{ width: "185px" }} alt="logo" />
                                            <h4 className="mt-1 mb-5 pb-1">Proyecto Final Sistema de Gestión de Pruebas y Control de Calidad</h4>
                                        </div>

                                        <form onSubmit={handleLogin}>
                                            <p>Por favor, ingresa tus credenciales</p>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    id="form2Example11"
                                                    className="form-control"
                                                    placeholder="Correo electrónico"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                                <label className="form-label" htmlFor="form2Example11">Email</label>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example22"
                                                    className="form-control"
                                                    placeholder="Clave"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <label className="form-label" htmlFor="form2Example22">Password</label>
                                            </div>

                                            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                                            <div className="text-center pt-1 mb-5 pb-1">
                                                <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit">
                                                    Ingresar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                    <div className="text-black px-3 py-4 p-md-5 mx-md-4">
                                        <h4 className="mb-4">¡Bienvenido! Nos alegra que estés aquí</h4>
                                        <p className="small mb-0">Este proyecto facilita el manejo de pruebas y el control de calidad en procesos tecnológicos. Proporciona herramientas para la creación, seguimiento y evaluación de pruebas, asegurando que cada paso cumpla con los estándares de calidad establecidos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
