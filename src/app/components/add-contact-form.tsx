"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addContact } from "app/actions/add-contact";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import Button from "./ui/button";
import Input from "./ui/input";
import { CircleUser, CircleX, LoaderPinwheel } from "lucide-react";

export default function AddContactForm({ setOpen }) {
  const [tooltip, setTooltip] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: undefined,
  });

  const [state, action, pending] = useActionState(addContact, undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.push("/");
    } else {
      setFormValues((prev) => ({ ...prev, avatar: undefined }));
    }
  }, [state, router, setOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setFormValues((prev) => ({ ...prev, avatar: files[0].name }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

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
      <div className="flex flex-col items-center justify-center gap-3 p-2">
        <div className="bg-background-secondary rounded-xl p-3">
          <CircleUser size={40} className="text-content-muted" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <input
            type="file"
            id="avatar"
            name="avatar"
            className="hidden"
            onChange={handleChange}
          />
          <label
            htmlFor="avatar"
            className="text-content-primary hover:bg-background-tertiary border-border-primary cursor-pointer rounded-lg border bg-transparent p-3 text-xs font-semibold"
          >
            + Adicionar foto
          </label>
          <p
            id="file-name"
            className="max-w-[290px] truncate text-xs text-gray-600"
          >
            {formValues.avatar}
          </p>
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
          value={formValues.name}
          onChange={handleChange}
        />
        {state?.errors?.name && (
          <div className="flex items-center gap-1">
            <CircleX width={16} className="text-accent-red" />
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
          value={formValues.phone}
          onChange={handleChange}
        />
        {state?.errors?.phone && (
          <div className="flex items-center gap-1">
            <CircleX width={16} className="text-accent-red" />
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
          value={formValues.email}
          onChange={handleChange}
        />
        {state?.errors?.email && (
          <div className="flex items-center gap-1">
            <CircleX width={16} className="text-accent-red" />
            <p className="text-content-body text-sm">{state.errors.email}</p>
          </div>
        )}
      </div>
      {state?.message && (
        <div className="flex items-center gap-1">
          <CircleX width={16} className="text-accent-red" />
          <p className="text-content-body text-sm">{state.message}</p>
        </div>
      )}
      {state?.errors?.avatar && (
        <div className="flex items-center gap-1">
          <CircleX width={16} className="text-accent-red" />
          <p className="text-content-body text-sm">{state.errors.avatar}</p>
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
          {pending ? <LoaderPinwheel className="animate-spin" /> : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
