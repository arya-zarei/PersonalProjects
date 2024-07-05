import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import Form from "../components/Form";
import '../styles/Login.css'; // Import a CSS file for styling

function Login(){
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <><button className="register-button" onClick={handleRegisterClick}>Register</button><Form route="/api/token/" method="login" /> 
        </> 
    )
}

export default Login