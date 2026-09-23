"use client";

import { Label, TextInput } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

interface SearchCommunityProps {
	onSearchChange: (query: string) => void;
}

export default function SearchCommunity({ onSearchChange }: SearchCommunityProps) {
	const [searchValue, setSearchValue] = useState("");

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			onSearchChange(searchValue);
		}, 150);

		return () => clearTimeout(timeoutId);
	}, [searchValue, onSearchChange]);

	return (
		<div className="flex flex-col grow space-y-2">
			<Label htmlFor="searchCommunity">Buscar</Label>
			<TextInput
				id="searchCommunity"
				type="search"
				icon={FaSearch}
				placeholder="Busca una comunidad"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
			/>
		</div>
	);
}
