import { db } from "../config/firebase-config";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const createAnime = async (data) => {

        const { gambar, genre, judul, jumlah_episode, rating, sinopsis, status } = data;
        const dataAnime = {
                gambar, genre, judul, jumlah_episode, rating, sinopsis, status
        }

        const newAnime = await addDoc(collection(db, "asi_web", "semua_data", "anime"), dataAnime);
        return { status_create: true, message: "Data anime berhasil ditambahkan", idAnime: newAnime.id}
}

export const readAnime = async () => {
        const snapshootAnime = await getDocs(collection(db, "asi_web", "semua_data", "anime"));
        
        const dataAnime = [];
        snapshootAnime.forEach((item) => {
                dataAnime.push({ id: item.id, ...item.data() })
        })
        
        return dataAnime;
}