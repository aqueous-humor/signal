"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@/generated/prisma/client";
import argon2 from "argon2";
import { RegisterSchema, LoginSchema } from "@/lib/validators/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Define the shape Zod returns for our specific fields
export type ZodFieldError = {
  _errors: string[];
};

// Define the shape of our Auth Action returns
export type AuthActionState = {
  success: boolean;
  error?: string;
  // Use a Record to map field names to their specific Zod error arrays
  details?: Record<string, ZodFieldError>;
  message?: string;
} | null;

// REGISTRATION ACTION
export async function registerUser(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  // Convert the FormData into a plain object Zod can read
  const data = Object.fromEntries(formData.entries());

  // Validate Input
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    const fieldErrors = z.formatError(
      validatedFields.error,
    ) as unknown as Record<string, ZodFieldError>;
    return {
      success: false,
      error: "Validation failed",
      details: fieldErrors,
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        error: "This email is already registered.",
      };
    }

    // Hash Password
    const passwordHash = await argon2.hash(password);

    // Atomic Creation (Prisma Transaction)
    await prisma.$transaction(async (tx) => {
      const workspaceName = name
        ? `${name}'s Workspace`
        : `${email.split("@")[0]}'s Workspace`;

      const workspace = await tx.workspace.create({
        data: { name: workspaceName },
      });

      await tx.user.create({
        data: {
          email,
          name: name ?? null,
          passwordHash,
          role: Role.OWNER,
          workspaceId: workspace.id,
        },
      });
    });

    // Cleanup & Redirect
    revalidatePath("/");

    redirect("/dashboard");
    return {
      success: true,
      message: "Account created successfully. You can now log in.",
    };
  } catch (error) {
    // Re-throw Next.js Redirects
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Registration Error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// LOGIN ACTION
export async function loginUser(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  // Convert FormData to plain object for Zod validation
  const data = Object.fromEntries(formData.entries());

  // Validate Input
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    const fieldErrors = z.formatError(
      validatedFields.error,
    ) as unknown as Record<string, ZodFieldError>;

    return {
      success: false,
      error: "Validation failed",
      details: fieldErrors,
    };
    // return { error: "Validation failed", details: z.formatError(validatedFields.error) };
  }

  // Perform Sign In
  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    // TypeScript needs to know what happens if signIn doesn't redirect
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error:
          error.type === "CredentialsSignin"
            ? "Invalid email or password."
            : "An unexpected error occurred.",
      };
    }
    // Re-throwing Next.js Redirects
    throw error;
  }
}

// SIGN OUT ACTION
export async function signOutUser() {
  try {
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    // Next.js redirects are technically errors that must be re-thrown
    throw error;
  }
}
