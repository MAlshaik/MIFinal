"use client";

import Image from "next/image";
import React, {useRef} from "react";
import {useRouter} from "next/navigation";
import ModifiedEditor, { ModifiedEditorHandle } from "@/components/Editor";

import { Button } from "@/components/ui/button"

export default function Home() { 
  const router = useRouter();
  const editorRef = useRef(null);

  const saveToSupabase = async () => {
  const editor = editorRef.current;
  if (!editor) {
    console.error('Error: Editor not found');
    return;
  }

  const content = editor.getHTML();

  fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to save notes (Status: ${response.status})`); 
    }

    console.log('Notes saved to Supabase!');
  })
  .catch(error => {
    console.error('Error saving notes:', error);
  });
}; 
 
  return (

    <main className="flex min-h-screen flex-col">
        <div className="flex flex-row px-24 py-8 justify-end">
            <Button onClick={() => router.push('/login')} >Login</Button>
        </div>
        <div className="flex flex-row px-24 justify-between">
            <div className="flex items-center w-full justify-center">
            <h1 className="text-4xl font-bold">Your personal notes editor</h1>
            </div>
            <Button className="bg-white text-black border-[#181818] border-2 hover:bg-[#C2C2C2]" onClick={saveToSupabase}>Save</Button>
        </div>
        <div> 
            <ModifiedEditor ref={editorRef}></ModifiedEditor>
        </div>
   </main>
  );
}
