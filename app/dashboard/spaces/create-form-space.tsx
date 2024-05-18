'use client';

import { Button } from '@/components/ui/button';
import Dropdown from '@/components/ui/dropdown';
import {
  CreateSpace,
  CreateUser,
  SpaceInfo,
  SpaceRegister,
  UserRegister
} from '@/lib/db';
import { space } from 'postcss/lib/list';
import React, { useState } from 'react';

function CreateSpaceFormView({
  dropdownSpaces
}: {
  dropdownSpaces: SpaceInfo[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropDownVal, setDropDownVal] = useState<SpaceInfo>();

  const handleCreateAccount = async (e: any) => {
    setLoading(true);
    // Get form data
    const name = document.getElementById('name') as HTMLInputElement;

    // Log form data
    console.log('Name:', name.value);

    const body: SpaceRegister = {
      Name: name.value,
      ParentSpaceID: dropDownVal ? dropDownVal.ID : undefined
    };

    await CreateSpace(body);
    setLoading(false);
    // Additional logic to create account...
  };

  const handleDropDownVal = (e: any) => {
    console.log(e.target.innerHTML);
    const spaceVal = dropdownSpaces.find(
      (space) => space.Name == e.target.innerHTML
    );
    if (spaceVal) {
      setDropDownVal(spaceVal);
    }
  };
  return (
    <>
      {isOpen && dropdownSpaces && (
        <div className="flex flex-col absolute h-fit w-2/4 z-50 place-self-center border rounded-lg border-transparent p-3">
          <div className="place-self-center w-full bg-card rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="flex w-full items-end justify-end px-2">
              <span className="cursor-pointer" onClick={() => setIsOpen(false)}>
                x
              </span>
            </div>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-background-foreground md:text-2xl">
                Create an account for user
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-card-foreground dark:text-white"
                  >
                    Space Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-card border  text-card-foreground sm:text-sm rounded-lg outline-none focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                    placeholder="Classroom 100"
                    required
                  />
                </div>
                <div>
                  <Dropdown
                    text={dropDownVal ? dropDownVal.Name : 'Root'}
                    items={dropdownSpaces.map((space) => space.Name)}
                    onClick={handleDropDownVal}
                  />
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
                    'Create space'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl w-full">Spaces</h1>
        <Button
          className="border bg-blue-600 hover:bg-blue-500"
          size="lg"
          variant="default"
          onClick={() => setIsOpen((prev: boolean) => !prev)}
        >
          Create space
        </Button>
      </div>
    </>
  );
}

export default CreateSpaceFormView;
