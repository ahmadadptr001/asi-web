import { db } from "../config/firebase-config";
import {  doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export const addComment = async (anime, newComment, newTime) => {
        try {
                console.log('test')
                const snapshootAnimeID = doc(db, "asi_web", "semua_data", "anime", anime.id);
                
                let dataComment = {};
                console.log(localStorage.getItem('status_login_fake'));

                // Validasi input
                if (newComment === "") {
                        return;
                }

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

export const deleteComment = async (anime, commentToDelete) => {
        try {
                const snapshootAnimeID = doc(db, "asi_web", "semua_data", "anime", anime.id);

                await updateDoc(snapshootAnimeID, {
                        komentar: arrayRemove(commentToDelete)
                });

                return { status_comment: true, message: "Komentar berhasil dihapus!" }
        } catch (e) {
                return { status_comment: false, message: e.message }
        }
}