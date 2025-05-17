import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from 'primereact/password';
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../utils/auth";


const SidebarRight = ({ visibleSidebarRight, setVisibleSidebarRight }) => {
        const navigate = useNavigate();
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [alert, setAlert] = useState("");
        const [checked, setChecked] = useState(false);

        const handleError = (text) => {
                return (
                        <span className="text-red-500 text-[.7rem]">
                                *{text}
                        </span>
                )
        }

        const handleSuccess = (text) => {
                return (
                        <span className="text-green-500 text-[.7rem]">
                                {text}
                        </span>
                )
        }
        
        const handleLogin = async() => {

                if (username === "" || password === "") {
                        setAlert(handleError("Username atau password tidak boleh kosong!"))
                        return
                }
                const responseLoginResult = await login(username, password);
                
                if (responseLoginResult.status_login === true) {
                        setAlert(handleSuccess(responseLoginResult.message));
                        if (checked) {
                                localStorage.setItem("status_login", "true");
                        }
                        localStorage.setItem("status_login_fake", "true");
                        setTimeout(() => {
                                navigate('/dashboard-admin');
                        }, 1500);
                } else {
                        setAlert(handleError(responseLoginResult.message));
                }

        }
        

        return (
                <>
                { visibleSidebarRight ? (
                        <>
                                { 
                                        localStorage.getItem('status_login') === "true" ? navigate('/dashboard-admin') : (
                                                <>
                                                        <Sidebar position="right" visible={visibleSidebarRight} onHide={() => setVisibleSidebarRight(!visibleSidebarRight)}>
                                                                <Divider />
                                                                <p className="text-xl">
                                                                        <i className="pi pi-user me-2"></i> Login Sebagai Admin
                                                                </p>
                                                                <div className="mb-10">
                                                                        {alert}
                                                                </div>
                                                                <div className="flex items center flex-col gap-3 mt-3">
                                                                        <FloatLabel>
                                                                                <InputText className="w-full" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                                                                <label htmlFor="username">Username </label>
                                                                        </FloatLabel>
                                                                        <Password value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} toggleMask />
                                                                        <div className="flex items-center gap-2 text-gray-500">
                                                                                <Checkbox onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>Ingatkan saya
                                                                        </div>
                                                                        <Button onClick={handleLogin} className="!mt-4" label="Login" severity="help" text raised />
                                                                </div>
                                                        </Sidebar>
                                                </>
                                        )
                                }
                        </>
                ) : (
                        <></>
                )}
                </>
        )
}

export default SidebarRight;