"use client";

import { useRouter } from "next/navigation";
import Button from "./ui/button";
import Input from "./ui/input";
import { useActionState, useEffect, useState } from "react";
import { signin } from "app/actions/signin";
import { CircleX, LoaderPinwheel } from "lucide-react";

export default function SigninForm() {
  const [formValues, setFormValues] = useState({
    email: "",
  });

  const [state, action, pending] = useActionState(signin, undefined);

  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/");
    }
  }, [state, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="text-content-primary text-sm font-bold"
        >
          E-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Digite seu e-mail"
          value={formValues.email}
          onChange={handleChange}
        />
        {state?.errors?.email && (
          <div className="flex items-center gap-0.5">
            <CircleX width={16} className="text-accent-red" />
            <p className="text-content-body text-sm">{state.errors.email}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="text-content-primary text-sm font-bold"
        >
          Senha
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Insira sua senha"
        />
        {state?.errors?.password && (
          <div className="flex items-center gap-0.5">
            <CircleX width={16} className="text-accent-red" />
            <p className="text-content-body text-sm">{state.errors.password}</p>
          </div>
        )}
      </div>
      {state?.message && (
        <div className="flex items-center gap-0.5">
          <CircleX width={16} className="text-accent-red" />
          <p className="text-content-body text-sm">{state.message}</p>
        </div>
      )}
      <div className="mt-9 flex justify-end">
        <Button type="submit" variant="primary" size="md" disabled={pending}>
          {pending ? (
            <LoaderPinwheel className="animate-spin" />
          ) : (
            "Acessar conta"
          )}
        </Button>
      </div>
    </form>
  );
}
