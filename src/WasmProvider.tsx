import { type ReactNode, useEffect, useRef, useState } from "react";
import init, { HeatmapRenderer } from "../pkg/mca_heatmap.js";
import { WorkerPool } from "./WorkerPool.ts";
import { asError } from "./util.ts";
import { WasmContext } from "./useWasm.ts";

function WasmProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);
  const [renderer, setRenderer] = useState<HeatmapRenderer | null>(null);
  const [workerPool, setWorkerPool] = useState<WorkerPool | null>(null);
  const setupOnce = useRef<boolean>(false);

  useEffect(() => {
    // annoying workaround for async setup with strict mode, there has to be a better way
    if (!setupOnce.current) {
      setupOnce.current = true;
      let r: HeatmapRenderer;
      let w: WorkerPool;
      init()
        .then(() => {
          r = new HeatmapRenderer();
          w = new WorkerPool(navigator.hardwareConcurrency);
          setRenderer(r);
          setWorkerPool(w);
        })
        .catch((err) => {
          console.error(err);
          setRenderer(null);
          setWorkerPool(null);
          setErr(asError(err).message);
        })
        .finally(() => setLoading(false));

      return () => {
        if (r) {
          r.free();
        }
        if (w) {
          w.free();
        }
      };
    }
  }, []);

  if (err !== null) {
    return <div>Fatal WASM error: {err}</div>;
  }

  if (loading || workerPool === null || renderer === null) {
    return <div>loading</div>;
  }

  return (
    <WasmContext value={{ renderer: renderer, workerPool: workerPool }}>
      {children}
    </WasmContext>
  );
}

export default WasmProvider;
