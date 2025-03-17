"use server";
import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  if (!endpoint || !project) {
    throw new Error("Missing Appwrite environment variables");
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");

  if (!session?.value) {
    throw new Error("No session found");
  }
  const client = new Client().setEndpoint(endpoint).setProject(project);
  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const apiKey = process.env.NEXT_APPWRITE_KEY;

  if (!endpoint || !project || !apiKey) {
    throw new Error("Missing Appwrite environment variables");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(apiKey);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}
