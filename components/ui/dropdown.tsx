'use client';
import React, { DOMAttributes, useState } from 'react';

function Dropdown({ text, items, onClick }: { text: string; items: string[], onClick?: React.MouseEventHandler<HTMLLIElement> | undefined }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className={`${isOpen && "focus:ring-purple-600 focus:ring-1"} border  focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center`}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {text}{' '}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isOpen && items.length > 0 && (
        <div
          id="dropdown"
          className="z-10 bg-card rounded-lg shadow w-fit"
        >
          <ul
            className="py-2 text-sm text-card-foreground max-h-20 overflow-y-auto"
            aria-labelledby="dropdownDefaultButton"
          >
            {items.map((item: string, index:number) => {
              return (
                <li 
                className="block px-6 py-2 hover:bg-card-hover hover:text-white"
                onClick={onClick}
                value={item}
                key={index}
                >
                    {item}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
