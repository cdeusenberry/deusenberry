"use server";
import { z } from "zod";

import { NamedApiResourceSchema } from "@/app/common/types";
import PokemoneSelector from "./components/pokemoneSelector";

const PokemonVersionGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  generation: NamedApiResourceSchema,
  pokedexes: NamedApiResourceSchema.array(),
  regions: NamedApiResourceSchema.array(),
  versions: NamedApiResourceSchema.array(),
});

export const getPokemonVersionGroup = async (name: string) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/version-group/${name}/`);
    const rawData = await res.json();

    const parsed = PokemonVersionGroupSchema.parse(rawData);
    return parsed;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error(`Failed to get Pokemon Version Group ${name}`);
  }
};

const PokedexSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_entries: z
    .object({
      entry_number: z.number(),
      pokemon_species: NamedApiResourceSchema,
    })
    .array(),
});
type Pokedex = z.infer<typeof PokedexSchema>;

const getPokedex = async (name: string) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokedex/${name}/`);
    const rawData = await res.json();

    const parsed = PokedexSchema.parse(rawData);
    return parsed;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error(`Failed to get Pokemon Version Group ${name}`);
  }
};

const pokemonNamesFromPokedex = (pokedex: Pokedex) => {
  return pokedex.pokemon_entries.map((entry) => entry.pokemon_species.name);
};

export default async function Page({
  params,
}: {
  params: { versionName: string };
}) {
  const versionGroup = await getPokemonVersionGroup(params.versionName);
  const pokedex = await getPokedex(versionGroup.pokedexes[0].name);
  const names = pokemonNamesFromPokedex(pokedex);

  return (
    <main className="p-4">
      <h2 className="text-lg">Pick your Pokemon!</h2>
      <PokemoneSelector pokemonNames={names} versionName={params.versionName} />
    </main>
  );
}
