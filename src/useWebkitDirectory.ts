import { createContext, useContext } from "react";
import type { McaFile } from "./util.ts";

type DirectoryContext = {
  browse: () => void;
  clearFiles: () => void;
  mcaFiles: McaFile[];
};

export const DirectoryContext = createContext<DirectoryContext | null>(null);

export function useWebkitDirectory() {
  const ctx = useContext(DirectoryContext);
  if (ctx === null) {
    throw new Error("useWebkitDirectory must be used within DirectoryProvider");
  }
  return ctx;
}
