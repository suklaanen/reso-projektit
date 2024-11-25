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
    documentId
} from 'firebase/firestore';

import { firestore } from './firebaseConfig'; 

    export const addItemToFirestore = async (uid, itemname, itemdescription, postalcode, city ) => {

        if (!itemname || !itemdescription || !postalcode || !city) {
            console.error('Virhe: Yksi tai useampi kenttä on tyhjä!');
            throw new Error('Täytä puuttuvat kentät.');
        }

        try {;
            const giverRef = doc(firestore, 'users', uid);
            const userDoc = await getDoc(giverRef); 
            const giverUsername = userDoc.data().username;

            const itemData = {
            itemname,
            itemdescription,
            postalcode,
            city,
            giverid: giverRef,
            givername: giverUsername,
            createdAt: serverTimestamp(),
            expirationAt: serverTimestamp(),
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

            await deleteDoc(itemRef);
            console.log(`UID: ${uid} poistanut: ${itemId}`);

        } catch (error) {
            console.error('Virhe poistettaessa itemiä Firestoresta:', error);
            throw error;
        }
      };

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