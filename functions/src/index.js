import handleInvalidThreads from "./handlers/handle-invalid-threads.js";
import handleExpiredTakers from "./handlers/handle-expired-takers.js";
import deleteExpiredItems from "./handlers/handle-expired-items.js";

export default async ({ req, res, log, error }) => {
  const functionId = process.env.APPWRITE_FUNCTION_ID;

  log(
    `Received request for function ${process.env.APPWRITE_FUNCTION_ID}`,
    req.body
  );

  switch (functionId) {
    case "handle-invalid-threads":
      return handleInvalidThreads({ req, res, log, error });
    case "handle-expired-takers":
      return handleExpiredTakers({ req, res, log, error });
    case "handle-expired-items":
      return deleteExpiredItems({ req, res, log, error });
    default:
      return res.json({ error: "Unknown function" }, 400);
  }
};
