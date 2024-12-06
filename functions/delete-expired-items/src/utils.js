import admin from "firebase-admin";
import {
  COLLECTION_TAKERS,
  COLLECTION_THREADS,
  COLLECTION_MESSAGES,
} from "./constants.js";

const firebaseConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
};

admin.initializeApp(firebaseConfig);

/**
 * firestore tietokanta
 * @type {FirebaseFirestore.Firestore}
 */
export const db = admin.firestore();

/**
 * hakee dokumentit, joiden expiration on aiempi kuin currentTime
 * @param {string} collectionName
 */
export const getExpiredDocuments = async (collectionName) =>
  await db
    .collection(collectionName)
    .where("expiration", "<=", new Date())
    .get();

/**
 * poistaa itemit ja niihin liittyvät takers ja threadit
 * @param {FirebaseFirestore.QuerySnapshot} querySnapshot - snapshot poistettavista dokumenteista
 */
export const handleBatchDeletion = async (querySnapshot) => {
  const batch = db.batch();

  for (const itemDoc of querySnapshot.docs) {
    // haetaan itemin alikokoelma takers
    const takersSnapshot = await itemDoc.ref
      .collection(COLLECTION_TAKERS)
      .get();

    // haetaan itemin threadit
    const threadSnapshot = await db
      .collection(COLLECTION_THREADS)
      .where("item", "==", itemDoc.ref)
      .get();

    // poistetaan alikokoelman takers dokumentit
    takersSnapshot.forEach((taker) => {
      batch.delete(taker.ref);
    });

    await Promise.all(
      threadSnapshot.docs.map(async (thread) => {
        // poistetaan threadin alikokoelman messages dokumentit
        const messages = await thread.ref.collection(COLLECTION_MESSAGES).get();
        messages.forEach((message) => {
          batch.delete(message.ref);
        });
        // poistetaan thread dokumentti
        batch.delete(thread.ref);
      })
    );

    // poistetaan item dokumentti
    batch.delete(itemDoc.ref);
  }

  await batch.commit();
};
