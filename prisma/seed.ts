import { prisma } from "@/lib/db/prisma";

async function main() {
  const existing = await prisma.workspace.findFirst({
    where: { name: "Signal Workspace" },
  });

  if (!existing) {
    await prisma.workspace.create({
      data: {
        name: "Signal Workspace",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
