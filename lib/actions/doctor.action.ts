/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ID } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  DOCTOR_COLLECTION_ID,
  ENDPOINT,
  PROJECT_ID,
  storage,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";

export const registerDoctor = async ({
  license,
  photo,
  ...doctor
}: RegisterDoctorParams) => {
  try {
    let file;
    let pic;

    if (photo) {
      const photoFile = InputFile.fromBuffer(
        photo?.get("blobFile") as Blob,
        photo?.get("fileName") as string
      );
      pic = await storage.createFile(BUCKET_ID!, ID.unique(), photoFile);
    }

    if (license) {
      const licenseFile = InputFile.fromBuffer(
        license?.get("blobFile") as Blob,
        license?.get("fileName") as string
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), licenseFile);
    }

    const newDoctor = await databases.createDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      ID.unique(),
      {
        photoId: pic?.$id || null,
        photoUrl: pic?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${pic.$id}/view?project=${PROJECT_ID}`
          : null,
        licenseDocumentId: file?.$id || null,
        licenseUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...doctor,
      }
    );
    revalidatePath("/", "layout");
    return parseStringify(newDoctor);
  } catch (error: any) {
    console.error("An error occurred while creating a new doctor:", error);
    throw new Error(error.message);
  }
};

export const updateDoctor = async ({
  doctorId,
  doctor: { license, photo, ...doctor },
}: UpdateDoctorParams) => {
  try {
    let file;
    let pic;

    if (photo) {
      const photoFile = InputFile.fromBuffer(
        photo?.get("blobFile") as Blob,
        photo?.get("fileName") as string
      );
      pic = await storage.createFile(BUCKET_ID!, ID.unique(), photoFile);
    }

    if (license) {
      const licenseFile = InputFile.fromBuffer(
        license?.get("blobFile") as Blob,
        license?.get("fileName") as string
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), licenseFile);
    }

    const updatedDoctor = await databases.updateDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      doctorId,
      {
        photoId: pic?.$id || doctor.photoId,
        photoUrl: pic?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${pic.$id}/view?project=${PROJECT_ID}`
          : doctor.photoUrl,
        licenseDocumentId: file?.$id || doctor.licenseDocumentId,
        licenseUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : doctor.licenseUrl,
        ...doctor,
      }
    );
    revalidatePath("/", "layout");
    return parseStringify(updatedDoctor);
  } catch (error: any) {
    console.error("An error occurred while updating the doctor:", error);
    throw new Error(error.message);
  }
};

export const deleteDoctor = async (doctorId: string) => {
  try {
    const deletedDoctor = await databases.deleteDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      doctorId
    );
    revalidatePath("/", "layout");
    return parseStringify(deletedDoctor);
  } catch (error) {
    console.error("An error occurred while deleting the doctor:", error);
  }
};

export const getDoctors = async () => {
  try {
    const doctors = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!
    );
    revalidatePath("/", "layout");
    return parseStringify(doctors.documents);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

export const getDoctor = async (doctorId: string) => {
  try {
    const doctor = await databases.getDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      doctorId
    );
    revalidatePath("/", "layout");
    return parseStringify(doctor);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
