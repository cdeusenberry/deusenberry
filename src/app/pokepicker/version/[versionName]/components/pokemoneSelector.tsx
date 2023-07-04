"use client";
import { useRouter } from "next/navigation";

export default function ({
  pokemonNames,
  versionName,
}: {
  pokemonNames: string[];
  versionName: string;
}) {
  const router = useRouter();

  return (
    <div>
      <select
        className="block appearance-none w-fit bg-white border border-gray-400 hover:border-green-500 px-4 py-2 pr-8 rounded leading-tight"
        onChange={(e) =>
          router.push(
            `/pokepicker/version/${versionName}/pokemon/${e.target.value}`
          )
        }
      >
        {pokemonNames.map((name) => (
          <option value={name}>{name}</option>
        ))}
      </select>
    </div>
  );
}
