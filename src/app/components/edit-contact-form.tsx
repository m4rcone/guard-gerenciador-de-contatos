"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import Button from "./ui/button";
import Input from "./ui/input";
import { editContact } from "app/actions/edit-contact";

export default function EditContactForm({ setOpen, contact }) {
  const [state, action, pending] = useActionState(handleSubmit, undefined);
  const router = useRouter();

  async function handleSubmit(state, formData: FormData) {
    formData.set("id", contact.id);

    return await editContact(state, formData);
  }

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.push("/");
    }
  }, [state, router, setOpen]);

  return (
    <form action={action} className="flex w-[290px] flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="name"
          className="text-content-primary font-semi-bold text-sm"
        >
          Nome
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Nome do contato"
          defaultValue={contact.name}
        />
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
        <Input
          id="phone"
          name="phone"
          placeholder="Número de telefone"
          defaultValue={contact.phone}
        />
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
          defaultValue={contact.email}
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
      <div className="flex justify-end gap-3 p-3 pr-0">
        <Dialog.Close asChild>
          <Button type="button" variant="tertiary" size="md">
            Cancelar
          </Button>
        </Dialog.Close>
        <Button type="submit" variant="primary" size="md" disabled={pending}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
