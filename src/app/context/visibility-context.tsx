"use client";

import { createContext, useState, type ReactNode } from "react";

interface VisibilityContextProps {
  visibleContactIds: Set<string>;
  setVisibleContactIds: (value: Set<string>) => void;
  toggleContactVisibility: (
    contactId: string | undefined,
    allContactsId: string[] | undefined,
  ) => void;
  isContactVisible: (contactId: string) => boolean;
}

export const VisibilityContext = createContext<
  VisibilityContextProps | undefined
>(undefined);

export function VisibilityProvider({ children }: { children: ReactNode }) {
  const [visibleContactIds, setVisibleContactIds] = useState<Set<string>>(
    new Set(),
  );

  const toggleContactVisibility = (
    contactId: string | undefined,
    allContactsId: string[] | undefined,
  ) => {
    setVisibleContactIds((prev) => {
      const newSet = new Set(prev);
      if (!contactId) {
        // Se já tinha algo visível → limpa (oculta todos)
        if (newSet.size > 0) {
          return new Set();
        }

        // Se estava vazio → adiciona todos
        return new Set(allContactsId);
      }

      if (newSet.has(contactId)) {
        newSet.delete(contactId); // Se já está visível, ocultar
      } else {
        newSet.add(contactId); // Se está oculto, tornar visível
      }

      return newSet;
    });
  };

  const isContactVisible = (contactId: string) => {
    return visibleContactIds.has(contactId);
  };

  return (
    <VisibilityContext.Provider
      value={{
        visibleContactIds,
        setVisibleContactIds,
        toggleContactVisibility,
        isContactVisible,
      }}
    >
      {children}
    </VisibilityContext.Provider>
  );
}
