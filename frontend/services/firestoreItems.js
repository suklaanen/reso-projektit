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
    limit,
    startAfter,
    collectionGroup,
    documentId,
} from 'firebase/firestore';

import { firestore } from './firebaseConfig'; 
import { now } from 'lodash';
import { Timestamp } from 'firebase/firestore';
import regionsAndCities from '../components/Sorted-maakunnat.json'; 

    export const addItemToFirestore = async (uid, itemname, itemdescription, city ) => {

        if (!itemname || !itemdescription || !city) {
            console.error('Virhe: Yksi tai useampi kenttä on tyhjä!');
            throw new Error('Täytä puuttuvat kentät.');
        }

        const allCities = Object.values(regionsAndCities).flat(); 
        const isCityValid = allCities.includes(city.trim());

        if (!isCityValid) {
            throw new Error('Tarkista kaupungin oikeinkirjoitus.');
        }


        try {;
            const giverRef = doc(firestore, 'users', uid);
            const userDoc = await getDoc(giverRef); 
            const giverUsername = userDoc.data().username;
            const now = Timestamp.now();

            const expiresInOneWeekSeconds = now.seconds + (7 * 24 * 60 * 60);
            const expiresInOneWeek = new Timestamp(expiresInOneWeekSeconds, 0); // nanosekunnit = 0
            
           // for testing: 2 minutes
           //const expiresInOneWeek = new Timestamp(now.seconds + 2 * 60, now.nanoseconds);

            const itemData = {
            itemname,
            itemdescription,
            city,
            giverid: giverRef,
            givername: giverUsername,
            createdAt: serverTimestamp(),
            expiration: expiresInOneWeek,
            };

            const docRef = await addDoc(collection(firestore, 'items'), itemData);
            console.log(`UID: ${uid} lisännyt:`, docRef.id);

            const takersRef = collection(firestore, `items/${docRef.id}/takers`);
            await addDoc(takersRef, { placeholder: true });
            console.log(`Lisätty alikokoelma (takers) tuotteelle ${docRef.id}`);

            return docRef.id;
        } catch (error) {
            console.error('Virhe lisättäessä tuotetta:', error);
            throw error;
        }
    };

    export const getItemsFromFirestore = async () => {
        try {
            const itemsRef = collection(firestore, 'items');
            const itemsSnapshot = await getDocs(itemsRef);
            const items = [];

            itemsSnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
            });

            return items;
        } catch (error) {
            console.error('Virhe haettaessa tuotteita:', error);
            throw error;
        }
    };

    export const paginateItems = async (lastDoc, pageSize,
        filter = undefined,
        refToCollection = () => collection(firestore, 'items'),
        idFieldHandler = (item) => item.id  ) => {
        try {
            const itemsRef = refToCollection();
            let q;

            if (lastDoc) {
                q = query(itemsRef, orderBy('createdAt'), startAfter(lastDoc), limit(pageSize));
            } else {
                q = query(itemsRef, orderBy('createdAt'), limit(pageSize));
            }

            if (filter) {
                q = query(q, filter());
            }

            const itemsSnapshot = await getDocs(q);
            const items = [];

            itemsSnapshot.forEach((doc) => {
                console.log(doc.data());
                items.push({ id: idFieldHandler(doc), ...doc.data() });
            });

            const lastVisibleDoc = itemsSnapshot.docs[itemsSnapshot.docs.length - 1];
            return { items, lastDoc: lastVisibleDoc };
        } catch (error) {
            throw error;
        }
    };

    export const getCurrentUserItems = async (uid, lastDoc, pageSize) => {
        return paginateItems(lastDoc, pageSize, () => where('giverid', '==', doc(firestore, 'users', uid)));
    };

    export const getCurrentUserItemQueues = async (uid, lastDoc, pageSize) => {
        const {items: itemIdRefs, lastDoc: newLastDoc} = await paginateItems(lastDoc, pageSize,
            () => where('takerId', '==', doc(firestore, 'users', uid)),
            () => collectionGroup(firestore, 'takers'),
            (doc) => doc.ref.parent.parent.id);

            const itemIds = itemIdRefs.map((doc) => doc.id);
            const {items} = await paginateItems(null, itemIds.length, () => where(documentId(), 'in', itemIds));
            return {items, lastDoc: newLastDoc};
    }

    export const getItemFromFirestore = async (itemId) => {
        try {
            const itemRef = doc(firestore, 'items', itemId);
            const itemSnapshot = await getDoc(itemRef);

            if (itemSnapshot.exists()) {
            const itemData = itemSnapshot.data();
            const itemId = itemSnapshot.id;
            const giverRef = itemData.giverid;
            const takersRef = collection(firestore, `items/${itemId}/takers`);

            return { itemId, ...itemData, giverRef, takersRef };
            } else {
            return null;
            }

        } catch (error) {
            console.error('Virhe haettaessa tuotetta:', error);
            throw error;
        }
    };

    export const deleteItemFromFirestore = async (uid, itemId) => {
        try {
            const itemRef = doc(firestore, 'items', itemId);

            if (!checkIfMyItem(uid, itemId)) {
                console.error('Virhe: Et voi poistaa toisen tuotteita.');
                throw new Error('Et voi poistaa toisten tuotteita.');
            }

            await deleteSubcollection(itemRef, 'takers');
            await deleteDoc(itemRef);
            console.log(`UID: ${uid} poistanut: ${itemId}`);

        } catch (error) {
            console.error('Virhe poistettaessa itemiä Firestoresta:', error);
            throw error;
        }
      };

    export const deleteExpiredItems = async () => {
        try {
            const itemsRef = collection(firestore, 'items');
            const q = query(itemsRef, where('expiration', '<=', Timestamp.now()));
            const snapshot = await getDocs(q);

            for (const docSnapshot of snapshot.docs) {
                const itemId = docSnapshot.id;

                await deleteSubcollection(docSnapshot.ref, 'takers');
                await deleteDoc(docSnapshot.ref);
                console.log(`Poistettu vanhentunut itemi ja sen takers: ${itemId}`);
            }

        } catch (error) {
            console.error('Virhe poistettaessa vanhentuneita itemeitä:', error);
            throw error;
        }
    }
        
    const deleteSubcollection = async (parentRef, subcollectionName) => {
        try {
            const subcollectionRef = collection(parentRef, subcollectionName);
            const snapshot = await getDocs(subcollectionRef);

            for (const docSnapshot of snapshot.docs) {
                await deleteDoc(docSnapshot.ref);
                console.log(`Poistettu ${subcollectionName} alikokoelmasta: ${docSnapshot.id}`);
            }
        } catch (error) {
            console.error(`Virhe poistettaessa ${subcollectionName} alikokoelmaa:`, error);
            throw error;
        }
    }

    export const checkIfMyItem = async (uid, itemId) => {
        try {
            const itemData = await getItemFromFirestore(itemId); 
            const { giverRef } = itemData; 

            if (giverRef.id === uid) {
                return true; 
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error checking item ownership:", error);
            return false;
        }
    };

   export const fetchQueueCount = async (itemId) => {
        
        try {
            const takersRef = collection(firestore, `items/${itemId}/takers`);
            const snapshot = await getDocs(takersRef);
            return snapshot.size -1;
        } catch (error) {
            console.error('Virhe jonottajien määrän hakemisessa:', error);
        }
      };