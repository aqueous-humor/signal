"use server";

import { prisma } from "@/lib/db/prisma";
import { Role } from "@/generated/prisma/client";
import argon2 from "argon2";
import { RegisterSchema } from "@/lib/validators/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function registerUser(formData: unknown) {
  // 1. Validate Input
  const validatedFields = RegisterSchema.safeParse(formData);

  if (!validatedFields.success) {
    const fieldErrors = z.formatError(validatedFields.error);

    return {
      error: "Validation failed",
      details: fieldErrors,
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    // 2. Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "Email already in use." };

    // 3. Hash Password
    const passwordHash = await argon2.hash(password);

    // 4. Atomic Creation (Prisma Transaction)
    await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: `${name || email.split("@")[0]}'s Workspace`,
        },
      });

      // Create the User and link to Workspace
      await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: Role.OWNER,
          workspaceId: workspace.id,
        },
      });
    });

    // 5. Cleanup & Return
    revalidatePath("/"); // Update any cached layouts
    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
