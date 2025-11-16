"use client";
import { Label, TextInput } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

interface SearchModulesProps {
  onSearchChange: (query: string) => void;
}

export default function SearchModules({ onSearchChange }: SearchModulesProps) {
  const [searchValue, setSearchValue] = useState("");

  // Debounce effect: espera 400ms después de que el usuario deje de escribir
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchValue);
    }, 150);

    // Cleanup: cancela el timeout si el usuario sigue escribiendo
    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearchChange]);

  return (
    <div className="flex flex-col grow space-y-2 ">
      <Label htmlFor="searchModules">Buscar</Label>
      <div className="">
        <TextInput
          id="searchModules"
          type="search"
          icon={FaSearch}
          placeholder="Busca un módulo"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </div>
  );
}
