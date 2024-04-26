"use client";

import Image from "next/image";
import React, {useRef} from "react";
import ModifiedEditor, { ModifiedEditorHandle } from "@/components/Editor";

export default function Home() {
  const editorRef = useRef(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Your personal notes editor</h1>
        <div> 
            <ModifiedEditor ref={editorRef}></ModifiedEditor>
        </div>
   </main>
  );
}
