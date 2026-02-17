import { prisma } from "@/lib/db/prisma";
import argon2 from "argon2";

async function main() {
  let workspace = await prisma.workspace.findFirst({
    where: { name: "Signal Workspace" },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: "Signal Workspace",
      },
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@signal.dev" },
  });

  if (!existingUser) {
    const passwordHash = await argon2.hash("Admin123!", {
      type: argon2.argon2id,
    });

    await prisma.user.create({
      data: {
        email: "admin@signal.dev",
        name: "Admin",
        passwordHash,
        role: "ADMIN",
        workspaceId: workspace.id,
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
