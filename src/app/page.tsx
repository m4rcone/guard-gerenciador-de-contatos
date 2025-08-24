import Image from "next/image";
import { getUser, getUserContacts } from "./lib/dal";
import Button from "./components/ui/button";
import AlphabetFilter from "./components/alphabet-filter";
import SearchInput from "./components/search-input";
import DataTable from "./components/data-table";
import { CircleUserRound, Lock, Settings } from "lucide-react";
import AddContactDialog from "./components/add-contact-dialog";
import Link from "next/link";
import SignoutButton from "./components/signout-button";

export default async function Page() {
  const user = await getUser();
  const contacts = await getUserContacts();

  return (
    <div className="bg-background-primary flex min-h-screen w-screen flex-col items-center gap-6 px-4 py-4 lg:h-screen lg:flex-row lg:px-9 lg:py-12">
      <div className="flex h-full w-full flex-row items-center justify-between px-[30px] lg:w-[111px] lg:flex-col">
        <Link href="/">
          <Image src="/logo-sm.png" alt="Logo Guard" width={29} height={32} />
        </Link>
        <div className="flex flex-row gap-3 lg:flex-col">
          <Link href="/">
            <Button type="button" variant="icon">
              <CircleUserRound className="text-accent-brand" />
            </Button>
          </Link>
          <div className="hidden lg:block">
            <Button type="button" variant="icon" disabled>
              <Settings className="text-content-muted" />
            </Button>
          </div>
          <SignoutButton />
        </div>
        <div>
          <p className="text-content-muted text-xs font-bold">Logado como:</p>
          <p className="text-content-body text-xs">{user.email}</p>
        </div>
      </div>
      <div className="bg-background-secondary h-full w-full rounded-[40px] p-[40px] lg:mr-12">
        <div className="flex h-full flex-col gap-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap lg:gap-0">
              <h2 className="text-content-primary text-2xl font-bold lg:flex-1">
                Lista de contatos
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 lg:flex-1 lg:flex-nowrap">
                <SearchInput />
                <AddContactDialog />
                {/* No lugar do Button vai ter outro componente */}
                <Button variant="tertiary" size="md">
                  <Lock size={16} />
                </Button>
              </div>
            </div>
          </div>
          <div className="scrollbar-custom flex flex-1 gap-12 overflow-y-auto">
            <AlphabetFilter />
            <DataTable contacts={contacts} />
          </div>
        </div>
      </div>
    </div>
  );
}
