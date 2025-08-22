import SigninForm from "app/components/signin-form";
import Image from "next/image";

export default function SigninPage() {
  return (
    <div className="h-screen w-screen">
      <div className="flex">
        <div className="hidden flex-1 bg-[url('/bg.png')] bg-cover bg-bottom md:block">
          <div className="px-[98px] py-[50px]">
            <Image src="/logo.svg" alt="" width={131} height={32} />
          </div>
        </div>
        <div className="bg-background-secondary flex h-screen w-screen flex-col px-8 py-[38.5px] sm:px-[88px] md:w-[497px]">
          <p className="text-content-body text-right text-xs">
            Não tem uma conta?{" "}
            <a href="/signup" className="text-accent-brand text-xs font-bold">
              Criar conta
            </a>
          </p>
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="text-content-primary text-2xl font-bold">
              Acessar conta
            </h2>
            <div className="mt-5">
              <SigninForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
