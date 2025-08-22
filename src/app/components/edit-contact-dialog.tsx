"use client";

import { Dialog } from "radix-ui";
import Button from "./ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import EditContactForm from "./edit-contact-form";

export default function EditContactDialog({ contact }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="tertiary">Editar</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Dialog.Content className="absolute top-1/2 left-1/2 z-50 max-h-svh -translate-x-1/2 -translate-y-1/2">
          <div className="bg-background-primary flex flex-col gap-1 rounded-2xl p-3">
            <Dialog.Title className="text-content-primary flex items-center justify-between p-3 text-xl font-bold">
              Editar contato
              <Dialog.Close>
                <X size={20} className="text-content-muted cursor-pointer" />
              </Dialog.Close>
            </Dialog.Title>
            <div className="px-4 pt-5">
              <EditContactForm setOpen={setOpen} contact={contact} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
