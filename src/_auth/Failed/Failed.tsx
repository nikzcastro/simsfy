import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Failed() {
    const navigate = useNavigate();

    const goBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-red-100">
            <div className="dark:text-black dark:bg-white bg-black/70 text-white p-8 rounded-lg shadow-lg w-96 text-center">
                <div className="text-red-500 text-6xl mb-4">
                    <i className="fas fa-exclamation-circle"></i>
                </div>
                <h2 className="text-2xl font-semibold text-red-500 mb-2">Oops! Algo deu errado.</h2>
                <p className="dark:text-black text-white/70 mb-6">
                    Não conseguimos autenticar você. Verifique suas credenciais e tente novamente.
                </p>
                <button 
                    onClick={goBackToLogin} 
                    className="px-6 py-2 bg-red dark:text-black text-white rounded-md hover:bg-red-600 transition duration-200"
                >
                    Tentar Novamente
                </button>
            </div>
        </div>
    );
}
