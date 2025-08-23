import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { redirect, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';

const Success = () => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { checkAuthUser } = useUserContext()
    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (!authToken || authToken == undefined) {
            navigate('/')
            return
        }
        setToken(authToken);

        if (authToken) {
            localStorage.setItem("authToken", authToken);
            console.log('Token encontrado:', authToken);
        } else {
            console.log('Token não encontrado');
        }

        setLoading(false);
        if (authToken) {
            checkAuthUser()
            navigate('/profile')
        }
    }, []);

    return <></>
    // return (
    //     <div className='w-full h-screen flex justify-center items-center bg-white text-black select-none'>
    //         {loading ? (
    //             <div className="flex flex-col items-center space-y-4">
    //                 <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full" role="status">
    //                     <span className="visually-hidden">Loading...</span>
    //                 </div>
    //                 <p className="text-lg text-black">Carregando as informações do usuário...</p>
    //             </div>
    //         ) : token ? (
    //             <div className="text-center">
    //                 <h1 className="text-2xl font-semibold text-black">Bem-vindo!</h1>
    //                 {/* <p className="mt-2 text-lg text-black">Token JWT encontrado e salvo com sucesso.</p> */}
    //             </div>
    //         ) : (
    //             <div className="text-center">
    //                 <h1 className="text-2xl font-semibold text-red-600">Erro!</h1>
    //                 <p className="mt-2 text-lg text-black">Não foi possível encontrar o token de autenticação.</p>
    //             </div>
    //         )}
    //     </div>
    // );
};

export default Success;
