import { handleExpiredTaker } from "../shared/utils.js";
import { COLLECTION_TAKERS } from "../shared/constants.js";
import db from "../shared/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export default async ({ res, log, error }) => {
  try {
    const takersSnapshot = await db.collectionGroup(COLLECTION_TAKERS).get();

    if (takersSnapshot.empty) {
      log("varaukset ovat ajan tasalla");
      return res.json({ message: "Varaukset ovat ajan tasalla." }, 200);
    }

    const expired = takersSnapshot.docs.filter(
      (doc) => doc.data().expiration && doc.data().expiration <= Timestamp.now()
    );

    log(`löydetty ${expired.length} vanhentunutta varausta:`);
    log(
      expired
        .map(
          (doc) =>
            `\t${doc.id} - ${doc.data().expiration?.toDate("yyyy-MM-dd HH:mm", "fi-FI")}`
        )
        .join("\n")
    );

    let count = 0;

    await Promise.all(
      expired.map(async (takerDoc) => {
        try {
          await handleExpiredTaker(takerDoc);
          log(`\t${takerDoc.id} käsitelty`);
          count++;
        } catch (err) {
          error(`virhe varauksen ${takerDoc.id} käsittelyssä: `, err);
        }
      })
    );

    return res.json(
      {
        message: "Vanhentuneet varaukset poistettu onnistuneesti.",
        processedCount: count,
      },
      200
    );
  } catch (e) {
    error("virhe vanhentuneiden varausten käsittelyssä: ", e);
    return res.json(
      {
        message: "Virhe vanhentuneiden varausten käsittelyssä.",
        error: e.message,
      },
      500
    );
  }
};
