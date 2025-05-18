import { db } from "../config/firebase-config";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export const addAnnouncement = async (newAnnouncement, newTime) => {
  try {
    const announcementRef = doc(db, "asi_web", "semua_data");

    const data = {
      isi: newAnnouncement,
      waktu: newTime,
      dibuatOleh: localStorage.getItem('status_login_fake') === 'true' ? 'Admin' : 'Pengguna'
    };

    await updateDoc(announcementRef, {
      pengumuman: arrayUnion(data)
    });

    return { status: true, message: "Pengumuman berhasil ditambahkan!" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

export const getAnnouncement = async () => {
  try {
    const docRef = doc(db, "asi_web", "semua_data");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const lastPengumuman = data.pengumuman?.[data.pengumuman.length - 1];
      return { status: true, data: lastPengumuman };
    } else {
      return { status: false, message: "Dokumen tidak ditemukan." };
    }
  } catch (err) {
    return { status: false, message: err.message };
  }
};
