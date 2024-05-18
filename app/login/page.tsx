'use client';

import { Spinner } from '@/components/icons';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/ui/login-form';
import { authenticate } from 'app/actions';
import { useFormState, useFormStatus } from 'react-dom';

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  return (
    <main className="flex items-center justify-center md:h-screen">
      <section className="bg-background w-full">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-background-foreground"
          >
            HITS Lock
          </a>
          <div className="w-full bg-card rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-background-foreground md:text-2xl">
                Sign in to your account
              </h1>
              <form action={dispatch} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-card-foreground"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-card border text-card-foreground sm:text-sm rounded-lg outline-none focus:ring-purple-600 focus:border-purple-600 w-full p-2.5"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-card-foreground"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-card border text-card-foreground sm:text-sm rounded-lg outline-none focus:ring-purple-600 focus:border-purple-600 w-full p-2.5"
                    required
                  />
                </div>

                <LoginButton />
                <div
                  className="flex h-8 items-end space-x-1"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {errorMessage && (
                    <>
                      <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="mt-4 border focus:border-purple-600 hover:bg-purple-600 w-full"
      size="lg"
      variant="default"
      aria-disabled={pending}
    >
      {pending ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        'Sign in'
      )}
    </Button>
  );
}
