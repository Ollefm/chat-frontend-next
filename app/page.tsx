"use client";
import TextBox from "@/components/TextBox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const greetings = [
    "One-one real-time messaging web application",
    "Built with Next.js and Golang",
  ];

  // Typing animation
  useEffect(() => {
    const currentPhrase = greetings[index];

    if (charIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 60);

      return () => clearTimeout(timeout);
    } else {
      // After a full phrase is written, wait then switch to next
      const timeout = setTimeout(() => {
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % greetings.length);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, index]);

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-2xl w-full">
        <h2 className="text-3xl md:text-4xl font-medium italic mb-8">
          ChatApp
        </h2>
        <TextBox
          onSend={() => router.push("/register")}
          text={displayText}
          setText={() => {}}
        />

        <p className="text-sm text-stone-500 mt-4">
          A hobby project made with Next.js and Golang.
        </p>
      </div>
    </div>
  );
}
