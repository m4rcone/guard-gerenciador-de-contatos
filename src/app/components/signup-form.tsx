"use client";

import { signup } from "app/actions/signup";
import Button from "./ui/button";
import Input from "./ui/input";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleX, LoaderPinwheel } from "lucide-react";

export default function SignupForm() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
  });

  const [state, action, pending] = useActionState(signup, undefined);

  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/signin");
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
          htmlFor="name"
          className="text-content-primary text-sm font-bold"
        >
          Nome
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Como você se chama?"
          value={formValues.name}
          onChange={handleChange}
        />
        {state?.errors?.name && (
          <div className="flex items-center gap-0.5">
            <CircleX width={16} className="text-accent-red" />
            <p className="text-content-body text-sm">{state.errors.name}</p>
          </div>
        )}
      </div>
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
          placeholder="Seu e-mail aqui"
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
          placeholder="Escolha uma senha segura"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="repeat"
          className="text-content-primary text-sm font-bold"
        >
          Repetir a senha
        </label>
        <Input
          id="repeat"
          name="repeat"
          type="password"
          placeholder="Repita sua senha para confirmar"
        />
      </div>
      {state?.errors?.password && (
        <div>
          <ul className="flex flex-col gap-1">
            {state.errors.password.map((error) => (
              <li
                className="text-content-body flex items-center gap-0.5 text-sm"
                key={error}
              >
                <CircleX width={16} className="text-accent-red" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      {state?.message && (
        <div className="flex items-center gap-0.5">
          <CircleX width={16} className="text-accent-red" />
          <p className="text-content-body text-sm">{state.message}</p>
        </div>
      )}
      <div className="mt-[68px] flex justify-end">
        <Button type="submit" variant="primary" size="md" disabled={pending}>
          {pending ? (
            <LoaderPinwheel className="animate-spin" />
          ) : (
            "Criar conta"
          )}
        </Button>
      </div>
    </form>
  );
}
