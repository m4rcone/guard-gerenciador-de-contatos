import SignupForm from "app/components/signup-form";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="h-screen w-screen">
      <div className="flex">
        <div className="hidden flex-1 bg-[url('/bg.png')] bg-cover bg-bottom md:block">
          <div className="px-[98px] py-[50px]">
            <Image src="/logo.svg" alt="" width={131} height={32} />
          </div>
        </div>
        <div className="bg-background-secondary h-screen w-screen px-8 py-[38.5px] sm:px-[88px] md:w-[497px]">
          <div className="flex flex-col gap-[50px]">
            <p className="text-content-body text-right text-xs">
              Ja tem uma conta?{" "}
              <a href="/signin" className="text-accent-brand text-xs font-bold">
                Acessar conta
              </a>
            </p>
            <h2 className="text-content-primary text-2xl font-bold">
              Criar conta
            </h2>
            <div>
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
