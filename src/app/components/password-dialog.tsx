"use client";

import { Dialog } from "radix-ui";
import Button from "./ui/button";
import { CircleX, LoaderPinwheel, Lock, Unlock, X } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import Input from "./ui/input";
import { verifyPassword } from "app/actions/verify-password";

interface PasswordDialogProps {
  onToggleVisibility: () => void;
}

export default function PasswordDialog({
  onToggleVisibility,
}: PasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(verifyPassword, undefined);

  useEffect(() => {
    if (state?.success) {
      onToggleVisibility();
      setOpen(false);
    }
  }, [state, setOpen]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (state) {
      state.message = undefined;
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button variant="tertiary" size="sm">
          <Unlock size={12} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Dialog.Content className="absolute top-1/2 left-1/2 z-50 max-h-svh -translate-x-1/2 -translate-y-1/2">
          <div className="bg-background-primary flex flex-col gap-1 rounded-2xl p-3">
            <Dialog.Title className="text-content-primary flex items-center justify-between p-3 text-xl font-bold">
              Visualizar informações
              <Dialog.Close>
                <X size={20} className="text-content-muted cursor-pointer" />
              </Dialog.Close>
            </Dialog.Title>
            <Dialog.Description />
            <div className="px-4 pt-5">
              <form action={action} className="flex w-[290px] flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="name"
                    className="text-content-primary font-semi-bold text-sm"
                  >
                    Senha
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Digite sua senha"
                  />
                  {state?.message && (
                    <div className="flex items-center gap-1">
                      <CircleX width={16} className="text-accent-red" />
                      <p className="text-content-body text-sm">
                        {state.message}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 p-3 pr-0">
                  <Dialog.Close asChild>
                    <Button type="button" variant="tertiary" size="md">
                      Voltar
                    </Button>
                  </Dialog.Close>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={pending}
                  >
                    {pending ? (
                      <LoaderPinwheel className="animate-spin" />
                    ) : (
                      "Confirmar"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
