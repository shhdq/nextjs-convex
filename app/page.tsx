"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"


export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const create = useMutation(api.tasks.create);
  const remove = useMutation(api.tasks.remove);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const text = formData.get("task") as string;

    await create({ text });
    form.reset();
  };

  const formatDate = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <main className="flex flex-col items-center py-10 px-5">
      <h1 className="font-bold text-3xl">
        Convex + Next.js | Task List
      </h1>

      <form 
        onSubmit={handleSubmit}
        className="flex gap-2 mt-10"
      >
        <Input 
          type="text" 
          name="task" 
          placeholder="Task" 
        />
        <Button>Submit</Button>
      </form>

      <h2 className="mt-10 font-bold text-2xl">
        The task list
      </h2>

      <div className="flex flex-col gap-2 mt-5 w-full lg:w-96">
        {tasks === undefined ? (
          // Loading state with skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index} 
              className="flex gap-2 py-2 items-center border-b-2 justify-between"
            >
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-[70px]" />
            </div>
          ))
        ) : (
          // Actual tasks
          tasks?.map(({ _id, text, _creationTime }) => (
            <div 
              key={_id} 
              className="flex gap-2 py-2 items-center border-b-2 justify-between"
            >
              <div className="flex flex-col">
              {text}
              <span className="text-sm text-gray-500">
                {formatDate(_creationTime)} {formatTime(_creationTime)}
              </span>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => remove({ id: _id })}
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}