"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "./ui/button";
import { Lock } from "lucide-react";
import EditContactDialog from "./edit-contact-dialog";
import DeleteContactDialog from "./delete-contact-dialog";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export default function DataTable({ contacts }: { contacts: Contact[] }) {
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const search = params.get("search");

  useEffect(() => {
    if (!search) {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(
        contacts.filter((contact) =>
          contact.name?.toLowerCase().includes(search?.toLowerCase()),
        ),
      );
    }
  }, [search, contacts]);

  return (
    <div className="flex flex-1 flex-col gap-7 lg:pr-[54px]">
      <div className="border-content-primary/50 border-b-[1px] pb-5">
        <p className="text-content-primary text-sm font-bold">
          {search ? search[0].toLocaleUpperCase() : "..."}
        </p>
      </div>
      <div className="table w-full min-w-[640px]">
        <div className="text-content-primary/40 table-header-group text-xs font-bold">
          <div className="table-row">
            <div className="table-cell pb-4">NOME</div>
            <div className="table-cell pb-4">TELEFONE</div>
            <div className="table-cell pb-4">EMAIL</div>
            <div className="table-cell pb-4"></div>
          </div>
        </div>
        <div className="text-content-body table-row-group text-sm">
          {filteredContacts.length > 0 &&
            filteredContacts.map((contact, key) => (
              <div
                key={key}
                className="table-row [&:last-child>.table-cell]:border-b-0"
              >
                <div className="border-content-primary/20 table-cell border-b py-3">
                  {contact.name}
                </div>
                <div className="border-content-primary/20 table-cell border-b py-3">
                  {contact.phone}
                </div>
                <div className="border-content-primary/20 table-cell border-b py-3">
                  {contact.email}
                </div>
                <div className="border-content-primary/20 table-cell border-b py-3">
                  <div className="flex items-center justify-end gap-2">
                    <EditContactDialog contact={contact} />
                    <Button variant="tertiary" size="sm">
                      <Lock size={12} />
                    </Button>
                    <DeleteContactDialog contact={contact} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
