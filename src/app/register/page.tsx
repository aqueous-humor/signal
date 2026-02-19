import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create an Account | Signal",
  description: "Join the idea sharing platform.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <RegisterForm />
    </main>
  );
}
