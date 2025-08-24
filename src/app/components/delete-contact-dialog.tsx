"use client";

import { Dialog } from "radix-ui";
import Button from "./ui/button";
import { LoaderPinwheel, Trash2, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteContact } from "app/actions/delete-contact";

export default function DeleteContactDialog({ contact }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(handleDelete, undefined);

  const router = useRouter();

  async function handleDelete(state, formData: FormData) {
    formData.set("id", contact.id);

    return await deleteContact(state, formData);
  }

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="tertiary" size="sm">
          <Trash2 size={12} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Dialog.Content className="absolute top-1/2 left-1/2 z-50 max-h-svh -translate-x-1/2 -translate-y-1/2">
          <div className="bg-background-primary flex flex-col gap-1 rounded-2xl p-3">
            <Dialog.Title className="text-content-primary flex items-center justify-between p-3 text-xl font-bold">
              Deletar contato
              <Dialog.Close>
                <X size={20} className="text-content-muted cursor-pointer" />
              </Dialog.Close>
            </Dialog.Title>
            <Dialog.Description asChild>
              <div className="text-content-primary flex w-[320px] flex-col p-3">
                <p className="truncate">Você deseja deletar o contato?</p>
                <p className="text-accent-brand truncate font-semibold">
                  {contact.name}
                </p>
              </div>
            </Dialog.Description>
            <div className="flex justify-end gap-3 p-3 pr-0">
              <Dialog.Close asChild>
                <Button type="button" variant="tertiary" size="md">
                  Cancelar
                </Button>
              </Dialog.Close>
              <form action={action}>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={pending}
                >
                  {pending ? (
                    <LoaderPinwheel className="animate-spin" />
                  ) : (
                    "Deletar"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
