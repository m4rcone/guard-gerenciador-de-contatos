"use client";

import { useContext } from "react";
import PasswordDialog from "./password-dialog";
import { VisibilityContext } from "app/context/visibility-context";
import { Contact } from "./data-table";
import Button from "./ui/button";
import { Unlock } from "lucide-react";

export default function PasswordDialogWrapper({
  contacts,
}: {
  contacts: Contact[];
}) {
  const { isContactVisible, toggleContactVisibility } =
    useContext(VisibilityContext);

  const allContactsIds = contacts.map((contact) => contact.id);

  const atLeastOneIsVisible = allContactsIds.some((contactId) =>
    isContactVisible(contactId),
  );

  if (atLeastOneIsVisible) {
    return (
      <Button
        variant="tertiary"
        size="sm"
        onClick={() => toggleContactVisibility(undefined, allContactsIds)}
      >
        <Unlock size={12} />
      </Button>
    );
  }

  return (
    <PasswordDialog
      onToggleVisibility={() =>
        toggleContactVisibility(undefined, allContactsIds)
      }
    />
  );
}
