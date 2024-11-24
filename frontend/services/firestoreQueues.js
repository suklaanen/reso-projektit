import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc,
    getDoc,
    serverTimestamp,
    orderBy,
} from 'firebase/firestore';
import { firestore } from './firebaseConfig'; 
import { get, last, take } from 'lodash';

    export const addTakerToItem = async (uid, itemId) => {
        try {
        const itemRef = doc(firestore, 'items', itemId);

        const itemSnapshot = await getDoc(itemRef);
        if (!itemSnapshot.exists()) {
            console.error('Virhe: Tuotetta ei löytynyt.');
            throw new Error('Tuotetta ei löytynyt.');
        }

        const itemData = itemSnapshot.data();
        const giverId = itemData.giverid.id;

        if (giverId === uid) {
            console.error('Virhe: Et voi varata omaa tuotettasi.');
            throw new Error('Et voi varata omaa tuotettasi.');
        }

        const takersRef = collection(itemRef, 'takers');

        const takerData = {
            takerId: doc(firestore, "users", uid), 
            createdAt: serverTimestamp(), 
        };

        await addDoc(takersRef, takerData);
        console.log(`UID: ${uid} varannut:`, itemId);

        } catch (error) {
        console.error('Virhe lisättäessä varausta:', error);
        throw error;
        }
    };

    export const itemQueuesForUser = async (uid, itemId) => {
        try {
            const userRef = doc(firestore, "users", uid); 
            const itemRef = doc(firestore, "items", itemId); 
            const takersRef = collection(itemRef, "takers"); 

            const q = query(takersRef, where("takerId", "==", userRef));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return false;
            }

            return querySnapshot;
        } catch (error) {
            console.error("Hakuvirhe:", error);
            throw error;
        }
    };

    export const deleteTakerFromItem = async (uid, itemId) => {
        try {
            const querySnapshot = await itemQueuesForUser(uid, itemId);

            for (const takerDoc of querySnapshot.docs) {
                await deleteDoc(takerDoc.ref);
                console.log(`UID: ${uid} poistanut varauksen:`, takerDoc.id);
            }
        } catch (error) {
            console.error("Poistovirhe:", error);
            throw error;
        }
    };

    export const getCurrentUserQueues = async (uid, itemId) => {
        try {

            const querySnapshot = await itemQueuesForUser(uid, itemId);

            if (querySnapshot) {
                console.log(`UID: ${uid} varannut: ${itemId}`);
                return true;
            }

        } catch (error) {
            console.error("Tarkistusvirhe:", error);
            return false; 
        }
    };
    
    export const getUserPositionInQueue = async (uid, itemId) => {
        try {
            const takersRef = collection(firestore, `items/${itemId}/takers`);

            const q = query(takersRef, orderBy("createdAt"));
            const snapshot = await getDocs(q);
    
            let position = 0;

            snapshot.docs.forEach((docSnapshot, index) => {
                const takerData = docSnapshot.data();
                if (takerData.takerId.id === uid) { 
                    position = index + 1;
                }
             });
            if (position === 0) {
                throw new Error("Käyttäjää ei löytynyt jonosta."); 
            }
    
            return position;
        } catch (error) {
            console.error("Virhe käyttäjän jonosijan hakemisessa:", error);
            throw error;
        }
    };