import { db, handleExpiredTaker } from "./utils.js";
import { COLLECTION_TAKERS } from "./constants.js";

export default async ({ res, log, error }) => {
  try {
    const currentTime = new Date();

    const takersSnapshot = await db.collectionGroup(COLLECTION_TAKERS).get();

    const expiredTakersSnapshot = takersSnapshot.docs.filter((takerDoc) => {
      const takerData = takerDoc.data();
      return takerData.expiration?.toDate() < currentTime;
    });

    expiredTakersSnapshot.forEach((takerDoc) => {
      const data = takerDoc.data();
      log(`taker ${data.takerId} expired at ${data.expiration.toDate()}`);
    });

    log(`expiredTakersSnapshot: ${expiredTakersSnapshot}`);

    if (!expiredTakersSnapshot.length) {
      log("no expired takers found");
      return res.json(
        {
          message: "No expired takers found.",
        },
        200
      );
    }

    const takerDeletionPromise = new Promise((resolve, reject) => {
      expiredTakersSnapshot.forEach((takerDoc, index, array) => {
        handleExpiredTaker(takerDoc);
        if (index === array.length - 1) resolve();
      });
    });

    takerDeletionPromise
      .then(async () => {
        log("expired takers deleted");
        return res.json(
          {
            message: "Expired takers deleted.",
          },
          200
        );
      })
      .catch((e) => {
        error("error handling expired takers: ", e);
        return res.json(
          {
            message: "error handling expired takers: " + e,
          },
          500
        );
      });
  } catch (e) {
    error("error deleting expired takers: ", e);
    return res.json(
      {
        message: "error deleting expired takers: " + e,
      },
      500
    );
  }
};
