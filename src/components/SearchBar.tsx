import { cn } from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
    className?: string;
};

export default function SearchBar(props: Props) {
  return (
    <form action="" onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10", props.className)}>
      <input
        type="text"
        name="searchBar"
        id="searchBar"
        placeholder="Search location"
        onChange={props.onChange}
        value={props.value}
        className="px-4 py-2 w-[14.375rem] border border-gray-300 
        rounded-l-md focus:outline-none focus:border-blue-500 h-full"
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md 
      focus:outline-none hover:bg-blue-600 h-full">
        <IoSearch />
      </button>
    </form>
  );
}
