import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import logo from "/src/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";

const Navigasi = ({ setVisibleSidebarRight }) => {
  const navigate = useNavigate();
  const [themeDark, setThemeDark] = useState(null); // null dulu, biar tahu kapan udah ke-load

  // Pas pertama load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
      setThemeDark(savedTheme === "dark");
    } else {
      setThemeDark(prefersDark);
    }
  }, []);

  // Apply theme ke html + simpan di localStorage
  useEffect(() => {
    if (themeDark === null) return; // Belum siap
    const theme = themeDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [themeDark]);

  return (
    <header className="flex justify-between py-0 bg-red-300 dark:bg-red-400 items-center px-7">
      <img onClick={() => navigate('/')} src={logo} alt="logo asi web" className="object-cover w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]"/>
      <ul className="flex items-center gap-4">
        <li>
          <button onClick={() => setThemeDark(!themeDark)}>
            {/* <i className={`fa fa-${getIconClass()} text-white rounded-[50%] text-sm p-2 px-2 !font-extrabold sm:text-lg`}></i> */}
                {themeDark ? <FaMoon className="!bg-blue-400 text-white rounded-[50%] w-8 h-8 p-2 px-2 !font-extrabold sm:text-lg" /> : <IoSunny className="!bg-yellow-500 text-white rounded-[50%] w-8 h-8 p-2 px-2 !font-extrabold sm:text-lg" />}
          </button>
        </li>
        <li>
          <Button
            label="Admin"
            icon="pi pi-user !text-sm"
            onClick={() => setVisibleSidebarRight(true)}
            className="gap-1 !text-sm !text-white !bg-sky-500 !border-none focus:!shadow-none !px-3 !py-2"
          />
        </li>
      </ul>
    </header>
  );
};


export default Navigasi;
