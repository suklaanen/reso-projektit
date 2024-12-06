import { getExpiredDocuments, handleBatchDeletion } from "./utils.js";
import { COLLECTION_ITEMS } from "./constants.js";

export default async ({ res, log, error }) => {
  try {
    const querySnapshot = await getExpiredDocuments(COLLECTION_ITEMS);

    if (querySnapshot.empty) {
      log("ilmoitukset ovat ajan tasalla");
      return res.empty();
    }

    await handleBatchDeletion(querySnapshot);
    log(`${querySnapshot.size} vanhentunutta ilmoitusta poistettu`);

    return res.json(
      {
        message: "Vanhentuneet ilmoitukset poistettu onnistuneesti.",
      },
      200
    );
  } catch (e) {
    error("ilmoitusten poistossa tapahtui virhe: ", e);
    return res.json(
      {
        message: "Error deleting expired items: " + e,
      },
      500
    );
  }
};
