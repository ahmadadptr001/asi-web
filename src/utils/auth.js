import { db } from "../config/firebase-config";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export const login = async (username, password) => {
        const snapshootAdmin = await getDocs(collection(db, "asi_web", "semua_data", "admin"));

        for (const item of snapshootAdmin.docs) {

                const usernameAdmin = item.data().username;
                const passwordAdmin = item.data().password;
                console.log('username',usernameAdmin)

                if (username !== usernameAdmin) {
                        return { status_login: false, message: "Username anda salah!"};
                }

                if (password !== passwordAdmin ) {
                        return { status_login: false, message: "Password anda salah!"};
                }
                localStorage.setItem('data_user', JSON.stringify(item.data()))
                return { status_login: true, message: "Login sukses"};
        }
}

export const createAdmin = async (usernameUser, passwordUser) => {
        const dataRefAdmin = collection(db, "asi_web", "semua_data", "admin");

        const newAdmin = await addDoc(dataRefAdmin, {
                username: usernameUser,
                password: passwordUser,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
        });

        return { status_create: true, message: `Berhasil mendaftarkan akun`, idAdmin: newAdmin.id };

}

export const dataAdmin = async() => {
        const dataAdminRef = await getDocs(collection(db, "asi_web", "semua_data", "admin"));

        const dataAdminList = [];
        dataAdminRef.forEach((item) => {
                dataAdminList.push({ id: item.id, ...item.data() })
        })

        return dataAdminList;
}

