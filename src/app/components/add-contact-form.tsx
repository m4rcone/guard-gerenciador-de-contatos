"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addContact } from "app/actions/add-contact";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import Button from "./ui/button";
import Input from "./ui/input";

export default function AddContactForm({ setOpen }) {
  const [state, action, pending] = useActionState(addContact, undefined);
  const [tooltip, setTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.push("/");
    }
  }, [state, router, setOpen]);

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
    <form action={action} className="flex w-[290px] flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="name"
          className="text-content-primary font-semi-bold text-sm"
        >
          Nome
        </label>
        <Input id="name" name="name" placeholder="Nome do contato" />
        {state?.errors?.name && (
          <div className="flex items-center gap-0.5">
            <Image src="icons/cancel.svg" alt="" width={16} height={16} />
            <p className="text-content-body text-sm">{state.errors.name}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="phone"
          className="text-content-primary font-semi-bold text-sm"
        >
          Telefone
        </label>
        <Input id="phone" name="phone" placeholder="Número de telefone" />
        {state?.errors?.phone && (
          <div className="flex items-center gap-0.5">
            <Image src="icons/cancel.svg" alt="" width={16} height={16} />
            <p className="text-content-body text-sm">{state.errors.phone}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="text-content-primary font-semi-bold text-sm"
        >
          E-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="E-mail do contato"
        />
        {state?.errors?.email && (
          <div className="flex items-center gap-0.5">
            <Image src="icons/cancel.svg" alt="" width={16} height={16} />
            <p className="text-content-body text-sm">{state.errors.email}</p>
          </div>
        )}
      </div>
      {state?.message && (
        <div className="flex items-center gap-0.5">
          <Image src="icons/cancel.svg" alt="" width={16} height={16} />
          <p className="text-content-body text-sm">{state.message}</p>
        </div>
      )}

      {tooltip && (
        <div className="flex justify-center">
          <p className="text-accent-brand text-xs">
            Tá esperando o quê? Boraa moeer!! 🚀
          </p>
        </div>
      )}
      <div className="flex justify-end gap-3 p-3">
        <Dialog.Close asChild>
          <Button type="button" variant="tertiary" size="md">
            Cancelar
          </Button>
        </Dialog.Close>
        <Button
          type="submit"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          variant="primary"
          size="md"
          disabled={pending}
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
