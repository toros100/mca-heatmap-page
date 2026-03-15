import { createContext, useContext } from "react";
import type { WorkerPool } from "./WorkerPool.ts";
import type { HeatmapRenderer } from "../pkg";

type WasmContext = {
  workerPool: WorkerPool;
  renderer: HeatmapRenderer;
};

export const WasmContext = createContext<WasmContext | null>(null);

export function useWasm() {
  const ctx = useContext(WasmContext);
  if (ctx === null) {
    throw new Error("useWasm must be used within WasmProvider");
  }
  return ctx;
}
