"use server";
import { z } from "zod";

import { NamedApiResourceSchema } from "@/app/common/types";
import VersionGroupSelector from "./components/versionGroupSelector";

const PokemonVersionGroupsResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: NamedApiResourceSchema.array(),
});

const getPokemonVersionGroups = async (
  offset: number = 0,
  limit: number = 50
) => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/version-group/?offset=${offset}&limit=${limit}`
    );
    const rawData = await res.json();

    const parsed = PokemonVersionGroupsResponseSchema.parse(rawData);
    return parsed.results;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Failed to get Pokemon Version Groups");
  }
};

export default async function PokePicker() {
  const versionGroups = await getPokemonVersionGroups();

  return (
    <main className="p-4">
      <h2 className="text-lg">Pick your game!</h2>
      <VersionGroupSelector versionGroups={versionGroups} />
    </main>
  );
}
