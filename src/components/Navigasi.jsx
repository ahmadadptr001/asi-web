import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import logo from "/src/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";

import { getAnnouncement } from "../utils/handleAnnouncement";

const Navigasi = ({ setVisibleSidebarRight }) => {
  const navigate = useNavigate();
  const [themeDark, setThemeDark] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  // Pas pertama load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setThemeDark(savedTheme === "dark");
    } else {
      setThemeDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await getAnnouncement();
      console.log("🔥 Announcement Response:", res);

      if (res.status) {
        setAnnouncement(parseAnnouncement(`📢 ${res.data.isi} 📨`));
      } else {
        setAnnouncement("📢 Tidak ada pengumuman terbaru.");
      }
    };

    fetchAnnouncements();
  }, []);

const parseAnnouncement = (text) => {
  const urlRegex = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  const matches = [...text.matchAll(urlRegex)];

  if (matches.length === 0) return text;

  const result = [];
  let lastIndex = 0;

  for (const match of matches) {
    const url = match[0];
    const start = match.index;

    if (start > lastIndex) {
      result.push(text.slice(lastIndex, start));
    }

    const href = url.startsWith("http") ? url : `https://${url}`;

    result.push(
      <a
        key={start}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400"
      >
        {url}
      </a>
    );

    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
};


  // Apply theme ke html + simpan di localStorage
  useEffect(() => {
    if (themeDark === null) return; // Belum siap
    const theme = themeDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [themeDark]);

  return (
    <>
      <div className="w-full bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 text-center py-2 px-4 text-sm font-medium shadow-sm sticky top-0 z-50">
        {announcement}
      </div>

      <header className="flex justify-between py-0 bg-red-300 dark:bg-red-400 items-center px-7">
        <img
          onClick={() => navigate("/")}
          src={logo}
          alt="logo asi web"
          className="object-cover w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]"
        />
        <ul className="flex items-center gap-4">
          <li>
            <button onClick={() => setThemeDark(!themeDark)}>
              {/* <i className={`fa fa-${getIconClass()} text-white rounded-[50%] text-sm p-2 px-2 !font-extrabold sm:text-lg`}></i> */}
              {themeDark ? (
                <FaMoon className="!bg-blue-400 text-white rounded-[50%] w-8 h-8 p-2 px-2 !font-extrabold sm:text-lg" />
              ) : (
                <IoSunny className="!bg-yellow-500 text-white rounded-[50%] w-8 h-8 p-2 px-2 !font-extrabold sm:text-lg" />
              )}
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
    </>
  );
};

export default Navigasi;
