"use client";

import { LogOut } from "lucide-react";
import Button from "./ui/button";
import { signout } from "app/actions/signout";
import { useRouter } from "next/navigation";

export default function SignoutButton() {
  const router = useRouter();

  async function handleSignout() {
    const result = await signout();
    console.log(result);
    router.push("/");
  }

  return (
    <Button
      type="button"
      variant="icon"
      onClick={async () => await handleSignout()}
    >
      <LogOut className="text-content-muted" />
    </Button>
  );
}
