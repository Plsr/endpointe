import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 justify-center h-screen bg-radial from-white to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      <h1 className="text-4xl font-bold font-serif">endpointe</h1>
      <p>A simple REST client</p>
      <Link
        href="/app"
        className="bg-[#eb7f2d] px-4 py-2 rounded-md font-bold text-white dark:text-[#e8d6c8]"
      >
        Go to App
      </Link>
      <small>v alpha-0.0.1</small>
    </div>
  );
}
