import { DirectoryContext } from "./useWebkitDirectory.ts";
import { type ReactNode, useRef, useState } from "react";
import * as React from "react";
import { type McaFile, parseFile } from "./util.ts";

function DirectoryProvider({ children }: { children: ReactNode }) {
  const [mcaFiles, setMcaFiles] = useState<McaFile[]>([]);

  function browse() {
    setMcaFiles([]);
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  function clearFiles() {
    setMcaFiles([]);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const mcaFiles = files.map(parseFile).filter((x) => x !== null);
    setMcaFiles(mcaFiles);
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        hidden={true}
        className={""}
        type="file"
        ref={inputRef}
        onChange={handleChange}
        {...{ webkitdirectory: "" }}
      />
      <DirectoryContext value={{ browse, mcaFiles, clearFiles }}>
        {children}
      </DirectoryContext>
    </>
  );
}

export default DirectoryProvider;
