/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ID, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    revalidatePath("/", "layout");
    return parseStringify(newUser);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginUser = async (user: LoginUserParams) => {
  try {
    let documents;
    if (user.email && user.phone) {
      documents = await users.list([
        Query.equal("email", user.email!),
        Query.equal("phone", user.phone!),
      ]);
    } else if (user.email && !user.phone) {
      documents = await users.list([Query.equal("email", user.email)]);
    } else if (user.phone && !user.email) {
      documents = await users.list([Query.equal("phone", user.phone!)]);
    }
    revalidatePath("/", "layout");
    return parseStringify(documents?.users[0]);
  } catch (error: any) {
    throw new Error("Invalid credentials provided " + error.message);
  }
};

export const logoutUser = async () => {
  try {
    cookies().set("accessToken", "", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 60,
      sameSite: "strict",
    });
  } catch (error) {
    console.error(error);
  }
};

export const createJwt = async (userId: string) => {
  try {
    const jwt = await users.createJWT(userId);
    cookies().set("accessToken", jwt.jwt, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 60,
      sameSite: "strict",
    });
    revalidatePath("/", "layout");
    return parseStringify(jwt);
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    revalidatePath("/", "layout");
    return parseStringify(user);
  } catch (error) {
    console.error(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        isRegistrationComplete: true,
        ...patient,
      }
    );
    revalidatePath("/", "layout");
    return parseStringify(newPatient);
  } catch (error: any) {
    console.error("An error occurred while creating a new patient:", error);
    throw new Error(
      error.message || "An error occurred while creating a new patient"
    );
  }
};

export const updatePatient = async ({
  patientId,
  patient: { identificationDocument, ...patient },
}: UpdateUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument

    const newPatient = await databases.updateDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      patientId,
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        isRegistrationComplete: true,
        ...patient,
      }
    );
    revalidatePath("/", "layout");
    return parseStringify(newPatient);
  } catch (error: any) {
    console.error("An error occurred while updating a new patient:", error);
    throw new Error(
      error.message || "An error occurred while updating a new patient"
    );
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    revalidatePath("/", "layout");
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

export const getPatients = async () => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!
    );
    revalidatePath("/", "layout");
    return parseStringify(patients.documents);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
