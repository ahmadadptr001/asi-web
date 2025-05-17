import { db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

export const readAllGenre = async () => {
        const snapshootGenre = await getDoc(doc(db, "asi_web", "genre_choice"));
        return snapshootGenre.data();
}
