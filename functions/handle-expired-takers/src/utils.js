import admin from "firebase-admin";
import {
  COLLECTION_MESSAGES,
  COLLECTION_TAKERS,
  COLLECTION_THREADS,
  TAKER_EXPIRATION_HOURS,
  MAX_BATCH_SIZE,
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

const getThreadsToDelete = async (itemRef, takerData) => {
  return await db
    .collection(COLLECTION_THREADS)
    .where("item", "==", itemRef)
    .where("participants", "array-contains", takerData.takerId)
    .get();
};

export const handleExpiredTaker = async (takerDoc) => {
  let currentBatch = db.batch();
  let operationCount = 0;

  const itemRef = takerDoc.ref.parent.parent;
  if (!itemRef) throw new Error("Invalid item reference");

  const takerData = takerDoc.data();
  if (!takerData) throw new Error("Invalid taker data");

  const now = admin.firestore.Timestamp.now();

  const threads = await getThreadsToDelete(itemRef, takerData);

  for (const thread of threads.docs) {
    const messages = await thread.ref.collection(COLLECTION_MESSAGES).get();

    for (const message of messages.docs) {
      currentBatch.delete(message.ref);
      operationCount++;

      if (operationCount >= MAX_BATCH_SIZE) {
        await currentBatch.commit();
        currentBatch = db.batch();
        operationCount = 0;
      }
    }

    currentBatch.delete(thread.ref);
    operationCount++;
  }

  await db.runTransaction(async (transaction) => {
    const nextInLineQuery = await itemRef
      .collection(COLLECTION_TAKERS)
      .orderBy("createdAt")
      .startAfter(takerData.createdAt)
      .limit(1)
      .get();

    const nextInLine = nextInLineQuery.docs[0];

    if (nextInLine) {
      const nextTakerData = nextInLine.data();
      const threadRef = db.collection(COLLECTION_THREADS).doc();
      const itemDoc = await itemRef.get();
      const itemData = itemDoc.data();

      if (!itemData?.giverid || !nextTakerData?.takerId) {
        throw new Error("Invalid giver or taker data");
      }

      const expirationTime = admin.firestore.Timestamp.fromMillis(
        now.toMillis() + TAKER_EXPIRATION_HOURS * 60 * 60 * 1000
      );

      transaction.set(threadRef, {
        participants: [itemData.giverid, nextTakerData.takerId],
        item: itemRef,
        createdAt: now,
      });

      transaction.set(nextInLine.ref, {
        ...nextTakerData,
        thread: threadRef,
        expiration: expirationTime,
      });
    }
  });
  currentBatch.delete(takerDoc.ref);
  await currentBatch.commit();
};
