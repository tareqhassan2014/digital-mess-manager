import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel - Illustration */}
      <div className="relative flex-1 lg:w-1/2 overflow-hidden bg-gradient-to-br from-blue-700 via-purple-500 to-pink-400 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-[300px] lg:min-h-screen">
        <div className="flex flex-col items-center justify-center w-full h-full p-8 lg:p-12">
          {/* Illustration */}
          <div className="relative w-64 h-64 lg:w-96 lg:h-96 mb-6 lg:mb-8">
            <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/assets/Gemini_Generated_Image_x40bhmx40bhmx40b-be291535-4afb-4bc5-b5e0-730f8a3af925.png"
                alt="Meal Calendar Illustration"
                fill
                className="object-contain dark:hidden rounded-full p-4"
                priority
              />
              <Image
                src="/assets/Gemini_Generated_Image_1xx9pe1xx9pe1xx9-b9dee51e-a90f-41a4-9a03-de7dfa3fd8bd.png"
                alt="Meal Calendar Illustration"
                fill
                className="object-contain hidden dark:block rounded-full p-4"
                priority
              />
            </div>
          </div>
          {/* Tagline */}
          <div className="text-center text-white space-y-2 px-4">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Manage Your Mess, Effortlessly.
            </h2>
            <p className="text-base lg:text-lg opacity-90">
              Your daily meals, sorted.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-gray-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
