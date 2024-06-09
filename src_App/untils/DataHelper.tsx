import {getDatabase, ref, push, onValue} from "firebase/database"
import { FIREBASE_APP } from "./firebase"

export const writeDataToRealTimeDB = (path: string, data: any) => {
    const db = getDatabase(FIREBASE_APP);
    const dbRef = ref(db, path);
    return push(dbRef,  data)
    .then((newDataRef) => {
        console.log("New data added with key: ", newDataRef.key);
        return newDataRef.key
    })
    .catch((error) => {
        console.error("Error adding data: ", error);
        return null;
    });
};

export const readDataToRealTimeDB = (path: string, callback: (data: any) => void) => {
    const db = getDatabase(FIREBASE_APP);
    const dbRef = ref(db, path);
    onValue(dbRef, (snapshot) =>{
      const data: any[] = [];
      snapshot.forEach((childSnapshot) => {
        const id = childSnapshot.key; // Lấy ID của nút dữ liệu
        const itemData = { id, ...childSnapshot.val() }; // Gộp ID vào dữ liệu
        data.push(itemData);
      });
      callback(data); // Truyền dữ liệu đã thêm ID vào callback
    });
  };
