"use client";

import { registerUser } from "@/lib/auth/actions";
import { AuthActionState, ZodFieldError } from "@/lib/auth/actions"; // Import our strict types

/// Define the exact shape Zod returns for our specific fields to match our casting
type ZodFormattedResults = Record<string, ZodFieldError | string[]>;

export default function TestRegPage() {
  const handleTest = async () => {
    console.log("🚀 Starting Registration Test...");

    const data = {
      email: `test-${Date.now()}@signal.dev`,
      password: "StrongPassword123!",
      name: "Test User",
    };

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    // We pass 'null' as the first argument to satisfy 'prevState'
    const result = await registerUser(null, formData);

    if (result?.success) {
      alert("✅ Success! User and Workspace created atomically.");
    } else if (result?.details) {
      // Double-cast to satisfy TS 5.x/6.x strictness
      const details = result?.details as unknown as ZodFormattedResults;

      console.log("❌ Error:", details);

      // Extract only the nested field errors
      const allErrors = Object.values(details)
        .flatMap((field) => {
          // Check if it's a field object with _errors or just a flat array
          if (Array.isArray(field)) return field;
          return field._errors || [];
        })
        .join("\n");

      alert(`Registration Failed:\n\n${allErrors}`);
    } else {
      alert(`Error: ${result?.error || "Something went wrong"}`);
    }
  };

  return (
    <div className="p-10">
      <button
        onClick={handleTest}
        className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
      >
        Test Registration Action
      </button>
    </div>
  );
}
