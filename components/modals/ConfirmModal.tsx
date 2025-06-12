"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: (result: boolean) => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  open,
  onClose,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
}: Props) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{message}</div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onClose(false)}>
            {cancelText}
          </Button>
          <Button onClick={() => onClose(true)}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
