"use client";

import { useRedirectWithLoader } from "@/hooks/useRedirectWithLoader";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { ReactNode } from "react";

interface ButtonWithLoadingProps {
  redirectTo: string;
  className?: string;
  disabled?: boolean;
  onClickExtra?: () => void | Promise<void>;
  children: ReactNode;
}

const ButtonWithLoading = ({
  redirectTo,
  className = "",
  disabled = false,
  onClickExtra,
  children,
}: ButtonWithLoadingProps) => {
  const { loading, handleRedirect } = useRedirectWithLoader();

  const handleClick = async () => {
    if (onClickExtra) await onClickExtra();
    handleRedirect(redirectTo);
  };

  return (
    <Button
      onClick={handleClick}
      className={`w-full cursor-pointer justify-center font-semibold transition violet-accent ${className}`}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default ButtonWithLoading;
