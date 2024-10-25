/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
  file?: string;
  files: File[];
  onChange: (files: File[]) => void;
  isPicUploader?: boolean;
};

const FileUploader = ({
  file,
  files,
  onChange,
  isPicUploader = false,
}: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`${isPicUploader ? "pic-upload" : "file-upload"}`}
    >
      <input {...getInputProps()} />

      {file && files?.length === 0 ? (
        <Image
          src={file}
          alt="uploaded image"
          width={1000}
          height={1000}
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : files && files.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          alt="uploaded image"
          width={1000}
          height={1000}
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            alt="upload"
            width={40}
            height={40}
          />

          <div className="file-upload_label">
            {isPicUploader ? (
              "Upload Picture"
            ) : (
              <>
                <p className="text-14-regular">
                  <span className="text-green-500"> Click to upload </span> or
                  drag and drop{" "}
                </p>
                <p>SVG,PNG,JPG or Gif (max 800x400)</p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
