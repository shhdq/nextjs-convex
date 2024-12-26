"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"


export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const create = useMutation(api.tasks.create);
  const remove = useMutation(api.tasks.remove);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const text = formData.get("task") as string;

    if (!text?.trim()) {
      setError("Task cannot be empty");
      toast({
        variant: "destructive",
        title: "Task cannot be empty",
        description: "Please enter a valid task description",
      });
      return;
    }

    try {
      await create({ text: text.trim() });
      form.reset();
      toast({
        
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task. Please try again.",
      });
    }
  };

  const handleDelete = async (id: Id<"tasks">) => {
    try {
      await remove({ id });
      toast({
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task",
      });
    }
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
        className="flex gap-2 mt-10 w-full max-w-md"
      >
        <Input 
          type="text" 
          name="task" 
          placeholder="Enter your task" 
          className="flex-1"
        />
        <Button
 
    >
      Show Toast
    </Button>
      </form>

      <h2 className="mt-10 font-bold text-2xl">
        Task List
      </h2>

      <div className="flex flex-col gap-2 mt-5 w-full max-w-md">
        {tasks === undefined ? (
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
          tasks?.map(({ _id, text, _creationTime }) => (
            <div 
              key={_id} 
              className="flex gap-2 py-2 items-center border-b-2 justify-between"
            >
              <div className="flex flex-col flex-1">
                <span className="font-medium">{text}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(_creationTime)} {formatTime(_creationTime)}
                </span>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDelete(_id)}
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