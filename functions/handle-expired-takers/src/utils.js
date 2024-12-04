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

const getThreadsToDelete = async (itemRef, takerData) => {
  return await db
    .collection(COLLECTION_THREADS)
    .where("item", "==", itemRef)
    .where("participants", "array-contains", takerData.takerId)
    .get();
};
const deleteThreadMessages = async (thread) => {
  const messages = await thread.ref.collection("messages").get();
  const docs = messages.docs;
  docs.forEach((message) => {
    message.ref.delete();
  });
};

export const handleExpiredTaker = async (takerDoc) => {
  const itemRef = takerDoc.ref.parent.parent;
  const takerData = takerDoc.data();

  const threads = await getThreadsToDelete(itemRef, takerData);

  const docs = threads.docs;

  await Promise.all(
    docs.map(async (thread) => {
      await deleteThreadMessages(thread);
      return thread.ref.delete();
    }),
  );

  const nextInLineQuery = await itemRef
    .collection(COLLECTION_TAKERS)
    .orderBy("createdAt")
    .startAfter(takerData.createdAt)
    .limit(1)
    .get();

  const nextInLine = nextInLineQuery.docs[0] ? nextInLineQuery.docs[0] : null;

  if (!!nextInLine) {
    const nextTakerData = nextInLine.data();
    const threadRef = db.collection(COLLECTION_THREADS).doc();
    const itemDoc = await itemRef.get();
    const itemData = itemDoc.data();
    await threadRef.set({
      participants: [itemData.giverid, nextTakerData.takerId],
      item: itemRef,
      createdAt: admin.firestore.Timestamp.now(),
    });
    await nextInLine.ref.set({
      ...nextTakerData,
      thread: threadRef,
      expiration: admin.firestore.Timestamp.fromMillis(
        admin.firestore.Timestamp.now().toMillis() + 6 * 60 * 60 * 1000,
      ),
    });
  }
  takerDoc.ref.delete();
};
