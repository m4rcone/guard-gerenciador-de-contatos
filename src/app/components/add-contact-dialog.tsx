"use client";

import { Dialog } from "radix-ui";
import Button from "./ui/button";
import AddContactForm from "./add-contact-form";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";

export default function AddContactDialog() {
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setTooltip(true);
    }, 7000); // 7 sec
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTooltip(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="relative inline-block">
          <Button
            variant="secondary"
            size="md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Plus width={16} />
            Adicionar contato
          </Button>
          {tooltip && (
            <div className="bg-background-primary text-accent-brand absolute left-1/2 mt-2 -translate-x-1/2 rounded-lg p-2 text-sm text-nowrap shadow-lg">
              Tá esperando o quê? Boraa moeer!! 🚀
            </div>
          )}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Dialog.Content className="absolute top-1/2 left-1/2 z-50 max-h-svh -translate-x-1/2 -translate-y-1/2">
          <div className="bg-background-primary flex flex-col gap-1 rounded-2xl p-3">
            <Dialog.Title className="text-content-primary flex items-center justify-between p-3 text-xl font-bold">
              Adicionar contato
              <Dialog.Close>
                <X size={20} className="text-content-muted cursor-pointer" />
              </Dialog.Close>
            </Dialog.Title>
            <Dialog.Description />
            <div className="px-4 pt-5">
              <AddContactForm setOpen={setOpen} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
