import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login | Signal",
  description: "Access your secure workspace.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}
