import { IUser } from '@/types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import googleImage from "../../public/assets/images/google.png"

interface Provider {
    provider: string;
}

export default function ModalSyncAccount({
    open,
    onClose,
    user
}: {
    open: boolean;
    onClose: () => void;
    user: IUser;
}) {
    const [unSyncedProviders, setUnSyncedProviders] = useState<string[]>([]);

    useEffect(() => {
        if (user && user.providers) {
            const missingProviders = ['GITHUB', 'DISCORD', 'GOOGLE'].filter(
                (provider) => !user.providers.some((p) => p.provider === provider)
            );
            setUnSyncedProviders(missingProviders);
        }
    }, [user]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0.5, opacity: 0 }}
                className="rounded-lg p-6 w-96 dark:text-white bg-gray-200 dark:bg-neutral-950 text-black transition-all duration-500">
                <h2 className="text-xl font-semibold mb-4">Sincronizar Conta</h2>
                {unSyncedProviders.length > 0 ? (
                    <div>
                        <p>Você ainda não vinculou as seguintes contas:</p>
                        <div className="mt-2 flex justify-center items-center gap-4">
                            {unSyncedProviders.map((provider) => (
                                <button
                                    key={provider}
                                    onClick={() => handleSync(provider.toLowerCase())}
                                    className={clsx(`${provider === "" ? "" : "bg-black"}`, "text-xs px-4 py-2 text-white rounded-md flex justify-center items-center gap-2")}>
                                    {provider === 'GITHUB' && (
                                        <div draggable={false}>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                                                <path fill="#fff" d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    {provider === 'DISCORD' && (
                                        <div draggable={false}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                                            </svg>
                                        </div>
                                    )}
                                    {provider === 'GOOGLE' && (
                                        <div draggable={false}>
                                            <img draggable={false} src={googleImage} alt="Google" className="w-6" />
                                        </div>
                                    )}
                                    {provider}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Suas contas já estão sincronizadas!</p>
                )}
                <div className="mt-4 text-center">
                    <button onClick={onClose} className="px-4 py-2 bg-black text-white rounded-md">
                        Fechar
                    </button>
                </div>
            </motion.div>
        </div>
    );

    function handleSync(provider: string) {
        const referer = window.location.href;
        const url = `${import.meta.env.VITE_BASE_URL}sync/callback?provider=${encodeURIComponent(provider)}&referer=${encodeURIComponent(referer)}`;
        window.open(url, '_self');
    }


}
