import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-6 text-center max-w-xl">
        <h1 className="text-5xl font-semibold tracking-tight">Signal</h1>

        <p className="text-neutral-400 text-lg py-5">
          A modern internal idea & feedback platform for focused teams.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-blue-900 hover:bg-blue-700">
            <Link href="#">Get Started</Link>
          </Button>

          <Button asChild size="lg" variant="ghost">
            <Link href="#">Learn More</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
