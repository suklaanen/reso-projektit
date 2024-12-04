import { Client, Account, Databases } from "appwrite";

const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } = process.env;

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);

const databases = new Databases(client);

export default { client, account, databases };
