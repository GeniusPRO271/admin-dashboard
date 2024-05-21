'use client';

import { Button } from '@/components/ui/button';
import { CreateUser, UserRegister } from '@/lib/db';
import { createUser } from 'app/actions';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { z } from 'zod';

export function ErrorMessageForm({
  message,
  color
}: {
  message: string;
  color?: string;
}) {
  return <p className={color + ' text-sm text-red-600 pt-2'}>{message}</p>;
}

function CreateFormView() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState({
    Name: '',
    Email: '',
    Password: '',
    Username: '',
    ConfirmPassword: '',
    ErrorRequest: '',
    Success: ''
  });

  const userRegisterSchema = z
    .object({
      Name: z.string().min(1, { message: 'Name is required' }),
      Email: z.string().email({ message: 'Invalid email address' }),
      Password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
      Username: z
        .string()
        .min(6, { message: 'Username must be at least 6 characters long' }),
      ConfirmPassword: z.string().min(6)
    })
    .superRefine(({ ConfirmPassword, Password }, ctx) => {
      if (ConfirmPassword !== Password) {
        ctx.addIssue({
          code: 'custom',
          message: 'The passwords did not match',
          path: ['ConfirmPassword']
        });
      }
    });

  const handleCreateAccount = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    setErrorMessages({
      Name: '',
      Email: '',
      Password: '',
      Username: '',
      ConfirmPassword: '',
      ErrorRequest: '',
      Success: ''
    });

    // Get form data
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement)
      .value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const confirmPassword = (
      document.getElementById('confirm-password') as HTMLInputElement
    ).value;

    const requestBody: UserRegister = {
      Name: name,
      Email: email,
      Password: password,
      Username: username
    };

    const zodBody = {
      Name: name,
      Email: email,
      Password: password,
      Username: username,
      ConfirmPassword: confirmPassword
    };

    // Validate data
    try {
      userRegisterSchema.parse(zodBody);

      const [userData, createUserError] = await CreateUser(requestBody);
      if (createUserError) {
        setErrorMessages((prevState) => ({
          ...prevState,
          ErrorRequest: createUserError.message
        }));
        console.error('Error creating user:', createUserError.message);
      } else {
        setErrorMessages((prevState) => ({
          ...prevState,
          Success: "User created :)"
        }));
        console.log('User created successfully:', userData);
      }

      // Create user
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.log('Error found');
        // Handle validation errors
        error.errors.forEach((err) => {
          const fieldName = err.path[0];
          setErrorMessages((prevState) => ({
            ...prevState,
            [fieldName]: err.message
          }));
        });
        console.log(errorMessages);
      }
    }

    setLoading(false);
  };
  return (
    <>
      {isOpen && (
        <div className="flex flex-col absolute h-fit w-2/4 z-50 place-self-center border rounded-lg border-transparent p-3">
          <div className="place-self-center w-full bg-card rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex w-full items-end justify-end px-2 py-2">
              <span
                className="cursor-pointer text-card-foreground"
                onClick={() => setIsOpen(false)}
              >
                <XIcon />
              </span>
            </div>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-background-foreground">
                Create an account for user
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-card-foreground"
                  >
                    User email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-card border  text-card-foreground sm:text-sm rounded-lg outline-none focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                    placeholder="name@email.com"
                    required
                  />
                  {errorMessages.Email && (
                    <ErrorMessageForm message={errorMessages.Email} />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-card-foreground"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-card border  text-card-foreground sm:text-sm rounded-lg outline-none focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                    placeholder="Pablo Escobar"
                    required
                  />
                  {errorMessages.Name && (
                    <ErrorMessageForm message={errorMessages.Name} />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-card-foreground"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-card border  text-card-foreground sm:text-sm rounded-lg outline-none focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                    placeholder="Escobar.Pablo"
                    required
                  />
                  {errorMessages.Username && (
                    <ErrorMessageForm message={errorMessages.Username} />
                  )}
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
                    className="bg-card border  text-card-foreground sm:text-sm rounded-lg outline-none focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                    required
                  />
                  {errorMessages.Password && (
                    <ErrorMessageForm message={errorMessages.Password} />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-card-foreground"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-card border  text-card-foreground sm:text-sm rounded-lg outline-none focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                    required
                  />
                  {errorMessages.ConfirmPassword && (
                    <ErrorMessageForm message={errorMessages.ConfirmPassword} />
                  )}
                </div>
                <Button
                  className="w-full bg-card border focus:border-purple-600 hover:bg-purple-600"
                  size="lg"
                  variant="default"
                  onClick={handleCreateAccount}
                  disabled={loading}
                >
                  {loading ? (
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
                    'Create user'
                  )}
                </Button>
                {errorMessages.ErrorRequest && (
                  <ErrorMessageForm message={errorMessages.ErrorRequest} />
                )}
                {errorMessages.Success && (
                  <ErrorMessageForm
                    message={'User Created' + ' :)'}
                    color="text-green-600"
                  />
                )}
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl w-full">Users</h1>
        <Button
          className="border bg-blue-600 hover:bg-blue-500"
          size="lg"
          variant="default"
          onClick={() => setIsOpen((prev: boolean) => !prev)}
        >
          Create user
        </Button>
      </div>
    </>
  );
}

export default CreateFormView;
