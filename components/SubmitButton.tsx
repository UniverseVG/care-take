import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

interface ButtonProps {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const SubmitButton = ({
  isLoading = false,
  className,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      onClick={onClick}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading ...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
