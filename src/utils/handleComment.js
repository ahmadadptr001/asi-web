import { db } from "../config/firebase-config";
import {  doc, updateDoc, arrayUnion } from "firebase/firestore";

export const addComment = async (anime, newComment, newTime) => {
        try {
                console.log('test')
                const snapshootAnimeID = doc(db, "asi_web", "semua_data", "anime", anime.id);
                
                let dataComment = {};
                console.log(localStorage.getItem('status_login_fake'));
                if (localStorage.getItem('status_login_fake') === 'true'){
                        dataComment = {
                                nama: 'Admin',
                                komen: newComment,
                                waktu: newTime
                        }
                } else {
                        dataComment = {
                                nama: 'Pengguna',
                                komen: newComment,
                                waktu: newTime
                        }
                }
                await updateDoc(snapshootAnimeID, {
                        komentar: arrayUnion(dataComment)
                });
        
                return { status_comment: true, message: 'Berhasil mengirim komentar Anda;)' }

        } catch (err) {
                return { status_comment: false, message:err.message }
                
        }
}