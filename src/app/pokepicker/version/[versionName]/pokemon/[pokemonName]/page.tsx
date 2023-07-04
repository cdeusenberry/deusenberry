"use server";
import { z } from "zod";

import { NamedApiResource, NamedApiResourceSchema } from "@/app/common/types";

const TypeRelationsSchema = z.object({
  no_damage_to: NamedApiResourceSchema.array(),
  half_damage_to: NamedApiResourceSchema.array(),
  double_damage_to: NamedApiResourceSchema.array(),
  no_damage_from: NamedApiResourceSchema.array(),
  half_damage_from: NamedApiResourceSchema.array(),
  double_damage_from: NamedApiResourceSchema.array(),
});

const Type = z.object({
  id: z.number(),
  name: z.string(),
  damage_relations: TypeRelationsSchema,
  generation: NamedApiResourceSchema,
  move_damage_class: NamedApiResourceSchema,
  pokemon: z
    .object({
      slot: z.number(),
      pokemon: NamedApiResourceSchema,
    })
    .array(),
  moves: NamedApiResourceSchema.array(),
});

const PokemonTypeSchema = z.object({
  slot: z.number(),
  type: NamedApiResourceSchema,
});
type PokemonType = z.infer<typeof PokemonTypeSchema>;

export const getPokemonTypes = async (types: PokemonType[]) => {
  const calls = types.map((type) => fetch(type.type.url));
  const responses = await Promise.all(calls);
  const rawDatas = await Promise.all(responses.map((res) => res.json()));

  const parsed = rawDatas.map((rawData) => Type.parse(rawData));
  return parsed;
};

type CounterResult = {
  best: string[];
  good: string[];
  bad: string[];
  worst: string[];
};

export const getBestCounters = async (
  pokemonTypes: PokemonType[]
): Promise<CounterResult> => {
  const types = await getPokemonTypes(pokemonTypes);
  const relations = new Map<string, number>();

  types.forEach((type) => {
    addTypeRelation(relations, type.damage_relations.double_damage_from, 2);
    addTypeRelation(relations, type.damage_relations.double_damage_to, -2);
    addTypeRelation(relations, type.damage_relations.half_damage_from, -1);
    addTypeRelation(relations, type.damage_relations.half_damage_to, 1);
    addTypeRelation(relations, type.damage_relations.no_damage_from, -2);
    addTypeRelation(relations, type.damage_relations.no_damage_to, 2);
  });

  const counterResult: CounterResult = {
    best: [],
    good: [],
    bad: [],
    worst: [],
  };

  // loop relations and place into result
  relations.forEach((value: number, key: string) => {
    if (value >= 3) {
      counterResult.best.push(key);
    } else if (value > 0) {
      counterResult.good.push(key);
    } else if (value <= -3) {
      counterResult.worst.push(key);
    } else if (value < 0) {
      counterResult.bad.push(key);
    }
  });

  return counterResult;
};

const addTypeRelation = (
  relations: Map<string, number>,
  typeNames: NamedApiResource[],
  modifier: number
) => {
  typeNames.forEach((typeName) => {
    let value: number = relations.get(typeName.name) || 0;
    value += modifier;
    relations.set(typeName.name, value);
  });
};

const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  game_indices: z
    .object({
      version: NamedApiResourceSchema,
    })
    .array(),
  types: PokemonTypeSchema.array(),
});

const getPokemon = async (name: string) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
    const rawData = await res.json();

    const parsed = PokemonSchema.parse(rawData);
    return parsed;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error(`Failed to get Pokemon Version Group ${name}`);
  }
};

export default async function Page({
  params,
}: {
  params: { pokemonName: string; versionName: string };
}) {
  console.log(params.versionName);
  const pokemon = await getPokemon(params.pokemonName);
  const counterTypes = await getBestCounters(pokemon.types);

  return (
    <main className="p-4">
      <h1 className="text-2xl">{pokemon.name}</h1>
      <div className="mb-4">
        {pokemon.types.map((type) => (
          <TypeSpan key={type.type.name} typeName={type.type.name} />
        ))}
      </div>
      <div className="mb-4">
        <h1 className="text-lg">Best Counter Types:</h1>
        {counterTypes.best.map((typeName) => (
          <TypeSpan key={typeName} typeName={typeName} />
        ))}
      </div>
      <div className="mb-4">
        <h1 className="text-lg">Good Counter Types:</h1>
        {counterTypes.good.map((typeName) => (
          <TypeSpan key={typeName} typeName={typeName} />
        ))}
      </div>
      <div className="mb-4">
        <h1 className="text-lg">Bad Counter Types:</h1>
        {counterTypes.bad.map((typeName) => (
          <TypeSpan key={typeName} typeName={typeName} />
        ))}
      </div>
      <div className="mb-4">
        <h1 className="text-lg">Worst Counter Types:</h1>
        {counterTypes.worst.map((typeName) => (
          <TypeSpan key={typeName} typeName={typeName} />
        ))}
      </div>
    </main>
  );
}

// Clunky, but this allows the use of the taiwind extended colors.
const TypeSpan = ({ typeName }: { typeName: string }) => {
  switch (typeName) {
    case "normal":
      return <span className="m-4 p-1 bg-normal rounded">{typeName}</span>;
    case "fire":
      return <span className="m-4 p-1 bg-fire rounded">{typeName}</span>;
    case "water":
      return <span className="m-4 p-1 bg-water rounded">{typeName}</span>;
    case "electric":
      return <span className="m-4 p-1 bg-electric rounded">{typeName}</span>;
    case "grass":
      return <span className="m-4 p-1 bg-grass rounded">{typeName}</span>;
    case "ice":
      return <span className="m-4 p-1 bg-ice rounded">{typeName}</span>;
    case "fighting":
      return <span className="m-4 p-1 bg-fighting rounded">{typeName}</span>;
    case "poison":
      return <span className="m-4 p-1 bg-poison rounded">{typeName}</span>;
    case "ground":
      return <span className="m-4 p-1 bg-ground rounded">{typeName}</span>;
    case "flying":
      return <span className="m-4 p-1 bg-flying rounded">{typeName}</span>;
    case "psychic":
      return <span className="m-4 p-1 bg-psychic rounded">{typeName}</span>;
    case "bug":
      return <span className="m-4 p-1 bg-bug rounded">{typeName}</span>;
    case "rock":
      return <span className="m-4 p-1 bg-rock rounded">{typeName}</span>;
    case "ghost":
      return <span className="m-4 p-1 bg-ghost rounded">{typeName}</span>;
    case "dragon":
      return <span className="m-4 p-1 bg-dragon rounded">{typeName}</span>;
    case "dark":
      return <span className="m-4 p-1 bg-dark rounded">{typeName}</span>;
    case "steel":
      return <span className="m-4 p-1 bg-steel rounded">{typeName}</span>;
    case "fairy":
      return <span className="m-4 p-1 bg-fairy rounded">{typeName}</span>;
    default:
      return <span className="m-4 p-1 rounded">{typeName}</span>;
  }
};
