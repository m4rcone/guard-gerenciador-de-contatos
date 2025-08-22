"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AlphabetFilter() {
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const search = searchParams.get("search")?.toLocaleLowerCase() || "";

  const handleFilter = (letter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", letter);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-accent-brand scrollbar-none hidden h-full max-h-full w-14 overflow-y-scroll rounded-[20px] lg:block">
      <div className="flex flex-col items-center gap-3 py-4">
        {alphabet.map((letter, key) => (
          <p
            key={key}
            onClick={() => handleFilter(letter.toLocaleLowerCase())}
            className={clsx(
              search.startsWith(letter.toLowerCase())
                ? "text-content-inverse text-2xl font-bold"
                : "text-content-muted cursor-pointer text-sm font-bold",
            )}
          >
            {letter}
          </p>
        ))}
      </div>
    </div>
  );
}
