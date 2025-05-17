import { useEffect, useState } from "react";

import { Button } from "primereact/button";
import logo from "/src/assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navigasi = ({ setVisibleSidebarRight }) => {
        const navigate = useNavigate();
        const [themeDark, setThemeDark] = useState(false);
        const [icon, setIcon] = useState('sun !bg-yellow-500');

        useEffect(() => {
                if (themeDark) {
                        document.querySelector('html').setAttribute('data-theme', 'dark');
                        setIcon('moon !bg-blue-400');
                        return;
                }
                document.querySelector('html').setAttribute('data-theme', 'light');
                setIcon('sun !bg-yellow-500');
        }, [themeDark])

        return (
                <header className="flex justify-between py-0 bg-red-300 dark:bg-red-400 items-center px-7">
                        <img onClick={() => navigate('/')} src={logo} alt="logo asi web" className="object-cover w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]"/>
                        {/* <p className="text-2xl font-extrabold">
                                <span className="text-white">ASI</span>-WEB
                        </p> */}
                        <ul className="flex items-center gap-4">
                                <li>
                                        <button onClick={() => setThemeDark(!themeDark)}>
                                                <i className={`fa fa-${icon} text-white rounded-[50%] text-sm p-2 px-2 !font-extrabold sm:text-lg`}></i>
                                        </button>
                                </li>
                                <li>
                                        <Button
                                                label="Admin"
                                                icon="pi pi-user !text-sm"
                                                onClick={() => setVisibleSidebarRight(true)}
                                                className="gap-1 !text-sm !text-white !bg-sky-500 !border-none focus:!shadow-none !px-3 !py-2">
                                        </Button>
                                </li>
                        </ul>
                </header>
        )
}

export default Navigasi;