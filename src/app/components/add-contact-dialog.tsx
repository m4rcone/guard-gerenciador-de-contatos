"use client";

import { Dialog } from "radix-ui";
import Button from "./ui/button";
import AddContactForm from "./add-contact-form";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function AddContactDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" size="md">
          <Plus width={16} />
          Adicionar contato
        </Button>
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
            <div className="px-4 pt-5">
              <AddContactForm setOpen={setOpen} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
