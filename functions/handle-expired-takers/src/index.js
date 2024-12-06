import { db, handleExpiredTaker } from "./utils.js";
import { COLLECTION_TAKERS } from "./constants.js";

export default async ({ res, log, error }) => {
  try {
    const currentTime = new Date();

    const takersSnapshot = await db.collectionGroup(COLLECTION_TAKERS).get();

    const expiredTakers = takersSnapshot.docs.filter(
      (doc) => doc.data().expiration?.toDate() < currentTime
    );

    if (expiredTakers.length === 0) {
      log("No expired takers found");
      return res.json({ message: "No expired takers found." }, 200);
    }

    expiredTakers.forEach((doc) => {
      const data = doc.data();
      log(`taker ${data.takerId} expired at ${data.expiration.toDate()}`);
    });

    await Promise.all(
      expiredTakers.map(async (takerDoc) => {
        try {
          await handleExpiredTaker(takerDoc);
        } catch (err) {
          error(`failed to process taker ${takerDoc.id}:`, err);
        }
      })
    );

    log("expired takers processed successfully");
    return res.json(
      {
        message: "Expired takers deleted.",
        processedCount: expiredTakers.length,
      },
      200
    );
  } catch (e) {
    error("error processing expired takers: ", e);
    return res.json(
      {
        message: "error deleting expired takers",
        error: e.message,
      },
      500
    );
  }
};
