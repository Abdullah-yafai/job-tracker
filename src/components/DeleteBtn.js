"use client";


import { deleteApplication } from "@/actions/jobActions";
import { useTransition } from "react";

export default function DeleteBtn({ id }) {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure?")) {
          startTransition(async () => {
            await deleteApplication(id);
          });
        }
      }}
      className="text-red-500 hover:text-red-700 disabled:opacity-50 text-sm font-bold"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}