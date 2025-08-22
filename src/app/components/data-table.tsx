"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "./ui/button";
import { CircleUser, Lock } from "lucide-react";
import EditContactDialog from "./edit-contact-dialog";
import DeleteContactDialog from "./delete-contact-dialog";
import clsx from "clsx";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar_url: string;
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
      <table className="table w-full min-w-[640px]">
        <thead className="text-content-primary/40 text-xs font-bold">
          <tr>
            <th className="pb-4 text-left">NOME</th>
            <th className="pb-4 text-left">TELEFONE</th>
            <th className="pb-4 text-left">EMAIL</th>
            <th className="pb-4"></th>
          </tr>
        </thead>
        <tbody className="text-content-body text-sm">
          {filteredContacts.length > 0 &&
            filteredContacts.map((contact, key) => (
              <tr key={key} className="[&:last-child>td]:border-b-0">
                <td className="border-content-primary/20 border-b py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "bg-background-tertiary overflow-hidden rounded-xl",
                        contact.avatar_url ? "h-11 w-11 p-0" : "p-3",
                      )}
                    >
                      {contact.avatar_url ? (
                        <img
                          src={contact.avatar_url}
                          alt="Avatar do contato"
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <CircleUser size={20} className="text-content-muted" />
                      )}
                    </div>
                    {contact.name}
                  </div>
                </td>
                <td className="border-content-primary/20 border-b py-3">
                  {contact.phone ? contact.phone : "-"}
                </td>
                <td className="border-content-primary/20 border-b py-3">
                  {contact.email ? contact.email : "-"}
                </td>
                <td className="border-content-primary/20 border-b py-3">
                  <div className="flex items-center justify-end gap-2">
                    <EditContactDialog contact={contact} />
                    <Button variant="tertiary" size="sm">
                      <Lock size={12} />
                    </Button>
                    <DeleteContactDialog contact={contact} />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
