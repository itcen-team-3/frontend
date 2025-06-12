// /context/ModalContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { AlertModal } from "@/components/modals/AlertModal";

interface ModalContextType {
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  showAlert: (options: AlertOptions) => void;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface AlertOptions {
  title?: string;
  message: string;
  buttonText?: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);
  const [alertState, setAlertState] = useState<AlertOptions | null>(null);
  const [confirmResolver, setConfirmResolver] = useState<
    ((result: boolean) => void) | null
  >(null);

  const showConfirm = (options: ConfirmOptions) => {
    setConfirmState(options);
    return new Promise<boolean>((resolve) => {
      setConfirmResolver(() => resolve);
    });
  };

  const showAlert = (options: AlertOptions) => {
    setAlertState(options);
  };

  const handleConfirm = (result: boolean) => {
    if (confirmResolver) confirmResolver(result);
    setConfirmState(null);
  };

  const handleAlertClose = () => {
    setAlertState(null);
  };

  return (
    <ModalContext.Provider value={{ showConfirm, showAlert }}>
      {children}
      <ConfirmModal
        message=""
        open={!!confirmState}
        onClose={handleConfirm}
        {...confirmState}
      />
      <AlertModal
        message=""
        open={!!alertState}
        onClose={handleAlertClose}
        {...alertState}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
