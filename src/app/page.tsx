import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="bg-green-500 p-4 ">
        <h1 className="text-xl">Next Test</h1>
      </div>
      <p className="p-4 text-base">A little space for experimentation.</p>
      <div className="p-4">
        <Link href="/pokepicker/" className="">
          <h2 className="text-lg underline">Pokepicker</h2>
          <p className="text-base">Select a pokemon and get counter types.</p>
        </Link>
      </div>
    </main>
  );
}
