"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  console.log(isLoading);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setMessage("");
    setError("");
    try {
      const success = await login(username, password);
      if (success) {
        router.push("/");
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      console.error("Network error during login:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-4 mx-auto p-4">
        <h1 className="text-2xl max-w-sm text-center font-medium">
          Welcome back!
        </h1>

        {(message || error) && (
          <div
            className={`w-full p-3 rounded-lg text-sm font-medium ${
              message
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message || error}
          </div>
        )}

        <form className="flex flex-col w-full gap-4" onSubmit={handleLogin}>
          <InputField
            id="username"
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={setUsername}
            disabled={isLoading}
            required
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            disabled={isLoading}
            required
          />

          <div className="mt-4">
            <Button type="submit" isLoading={isLoading}>
              Login
            </Button>
          </div>
        </form>

        <div className="flex items-center w-full gap-2 text-stone-400">
          <div className="flex-1 border-b border-stone-600"></div>
          <span className="text-sm">or</span>
          <div className="flex-1 border-b border-stone-600"></div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-sm text-stone-400">No account? </p>
          <Link href="/register" className="font-semibold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
