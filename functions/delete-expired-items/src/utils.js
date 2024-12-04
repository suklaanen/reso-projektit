import admin from "firebase-admin";
import { COLLECTION_TAKERS, COLLECTION_THREADS } from "./constants.js";

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
 * @param {Date} currentTime
 */
export const getExpiredDocuments = async (collectionName, currentTime) =>
  await db
    .collection(collectionName)
    .where("expiration", "<=", currentTime)
    .get();

/**
 * poistaa snapshotin dokumentit ja alikokoelman takers
 * @param {FirebaseFirestore.QuerySnapshot} querySnapshot - snapshot poistettavista dokumenteista
 */
export const handleBatchDeletion = async (querySnapshot) => {
  const batch = db.batch();

  for (const doc of querySnapshot.docs) {
    // itemin alikokoelma takers
    const takersSnapshot = await doc.ref.collection(COLLECTION_TAKERS).get();
    // threads, jossa itemRef == item field
    const itemThreadSnapshot = await db
      .collection(COLLECTION_THREADS)
      .where("item", "==", doc.ref)
      .get();

    // poistetaan alikokoelman takers dokumentit
    takersSnapshot.forEach((taker) => {
      batch.delete(taker.ref);
    });

    itemThreadSnapshot.forEach((thread) => {
      // poistetaan threadin alikokoelman messages dokumentit
      thread.ref
        .collection(COLLECTION_MESSAGES)
        .get()
        .then((messages) => {
          messages.size &&
            messages.forEach((message) => {
              batch.delete(message.ref);
            });
        })
        .catch((e) => {
          console.error("Messages alikokoelmaa ei voitu hakea: ", e);
        }) // poistetaan thread dokumentti
        .finally(() => batch.delete(thread.ref));
    });

    // poistetaan itse item dokumentti
    batch.delete(doc.ref);
  }

  await batch.commit();
};
