import { db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

export const readAllStatus = async () => {
        const snapshootStatus = await getDoc(doc(db, "asi_web", "status_chocie"));
        return snapshootStatus.data();
}
