import React from 'react';
import { useNavigate } from 'react-router-dom'; // Using useNavigate instead of useHistory
import Form from "../components/Form";
import '../styles/Register.css'; // Import a CSS file for styling

function Register() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <>
            <button className="login-button" onClick={handleLoginClick}>Login</button>
            <Form route="/api/user/register/" method="register" />
        </>
    );
}

export default Register;
