"use client";
import { useRouter } from "next/navigation";
import { NamedApiResource } from "@/app/common/types";

export default function ({
  versionGroups,
}: {
  versionGroups: NamedApiResource[];
}) {
  const router = useRouter();

  return (
    <div>
      <select
        className="block appearance-none w-fit bg-white border border-gray-400 hover:border-green-500 px-4 py-2 pr-8 rounded leading-tight"
        onChange={(e) => router.push(`/pokepicker/version/${e.target.value}`)}
      >
        {versionGroups.map((group) => (
          <option value={group.name}>{group.name}</option>
        ))}
      </select>
    </div>
  );
}
