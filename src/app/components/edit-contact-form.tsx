"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import Button from "./ui/button";
import Input from "./ui/input";
import { editContact } from "app/actions/edit-contact";
import { CircleUser } from "lucide-react";
import { clsx } from "clsx";

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
      <div className="flex flex-col items-center justify-center gap-3 p-2">
        <div
          className={clsx(
            "bg-background-secondary overflow-hidden rounded-xl",
            contact.avatar_url ? "h-16 w-16 p-0" : "p-3",
          )}
        >
          {contact.avatar_url ? (
            <img
              src={contact.avatar_url}
              alt="Avatar do contato"
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <CircleUser size={40} className="text-content-muted" />
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <input
            type="file"
            id="avatar"
            name="avatar"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              const fileName = document.getElementById("file-name");
              if (file) {
                fileName.textContent = file.name || "";
              }
            }}
          />
          <label
            htmlFor="avatar"
            className="text-content-primary hover:bg-background-tertiary border-border-primary cursor-pointer rounded-lg border bg-transparent p-3 text-xs font-semibold"
          >
            {!contact.avatar_url ? "+ Adicionar foto" : "Substituir"}
          </label>
          <span id="file-name" className="text-xs text-gray-600"></span>
        </div>
      </div>

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
