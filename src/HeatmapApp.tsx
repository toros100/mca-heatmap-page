import "./App.css";
import { useEffect, useRef, useState } from "react";
import RangeSelectorThing from "./RangeSelectorThing.tsx";
import type { Range, McaFile } from "./util.ts";
import { filterRange } from "./util.ts";
import { useWebkitDirectory } from "./useWebkitDirectory.ts";
import ProgressThing from "./ProgressThing.tsx";
import { useWasm } from "./useWasm.ts";
import PalettePicker from "./PalettePicker.tsx";

type Progress = {
  completed: number;
  total: number;
};

// a bit brittle, should just query current/default palette from WASM
const DEFAULT_PALETTE = [
  "#14001E",
  "#1E0997",
  "#AC00D9",
  "#D90000",
  "#D9A600",
  "#FFFFFF",
];

function HeatmapApp() {
  const { browse, mcaFiles } = useWebkitDirectory();
  const { renderer, workerPool } = useWasm();

  const [palette, setPalette] = useState(DEFAULT_PALETTE);

  const [numFiles, setNumFiles] = useState<number>(0);

  const [filteredFiles, setFilteredFiles] = useState<McaFile[]>([]);
  const processedFiles = useRef<McaFile[]>([]);

  const [editingPalette, setEditingPalette] = useState(false);

  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress>({
    completed: 0,
    total: 0,
  });

  const [rangeX, setRangeX] = useState<Range>({ min: 0, max: 0 });
  const [rangeZ, setRangeZ] = useState<Range>({ min: 0, max: 0 });
  const [selectedRangeX, setSelectedRangeX] = useState<Range>({
    min: 0,
    max: 0,
  });
  const [selectedRangeZ, setSelectedRangeZ] = useState<Range>({
    min: 0,
    max: 0,
  });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const urlRef = useRef<string | null>(null);

  function processPalette(pal: string[]) {
    // todo validate
    const str = pal.map((hex) => hex.substring(1)).join(":");
    console.log("palette string", str);
    return str;
  }

  useEffect(() => {
    const minX = Math.min(...mcaFiles.map((m) => m.regionX));
    const maxX = Math.max(...mcaFiles.map((m) => m.regionX));
    const minZ = Math.min(...mcaFiles.map((m) => m.regionZ));
    const maxZ = Math.max(...mcaFiles.map((m) => m.regionZ));

    const rX = { min: minX, max: maxX };
    setRangeX(rX);
    setSelectedRangeX(rX);

    const rZ = { min: minZ, max: maxZ };
    setRangeZ(rZ);
    setSelectedRangeZ(rZ);

    setNumFiles(mcaFiles.length);
  }, [mcaFiles]);

  function reset() {
    if (imgRef.current) {
      imgRef.current.src = "";
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    renderer.reset();
  }

  async function processRegions(mcaFiles: McaFile[]) {
    console.log("processRegions with", mcaFiles.length, "files");
    const total = mcaFiles.length;
    let idx = 1;

    setProgress({ completed: 0, total: mcaFiles.length });

    // needs exorcism
    return Promise.allSettled(
      mcaFiles.map((mcaFile: McaFile) => {
        return workerPool
          .enqueue_extraction(mcaFile.file)
          .then((res) => {
            try {
              renderer.submit_data(mcaFile.regionX, mcaFile.regionZ, res);
            } catch (e) {
              console.error("failed to submit data", e);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            if (!processedFiles.current.includes(mcaFile)) {
              processedFiles.current.push(mcaFile);
            }
            console.log("finished processing region", idx, "out of", total);
            setProgress(({ completed, total }) => ({
              completed: completed + 1,
              total,
            }));
            idx++;
          });
      }),
    );
  }

  function startProcessing() {
    setProcessing(true);
    const unprocessedFiles = filteredFiles.filter(
      (f) => !processedFiles.current.includes(f),
    );
    const rX = selectedRangeX;
    const rZ = selectedRangeZ;
    processRegions(unprocessedFiles).finally(() => {
      setProcessing(false);
      render(rX, rZ);
    });
  }

  function render(xRange: Range, zRange: Range) {
    try {
      const img = renderer.render_range(
        xRange.min,
        xRange.max,
        zRange.min,
        zRange.max,
      );
      displayImage(img);
    } catch (e) {
      console.error("failed to render", e);
    }
  }

  function displayImage(imageData: Uint8Array) {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    const blob = new Blob([imageData as BlobPart], { type: "image/png" });
    urlRef.current = URL.createObjectURL(blob);
    imgRef.current!.src = urlRef.current;
  }

  function selectDirectory() {
    reset();
    browse();
  }

  useEffect(() => {
    setFilteredFiles(filterRange(mcaFiles, selectedRangeX, selectedRangeZ));
  }, [selectedRangeX, selectedRangeZ, mcaFiles]);

  useEffect(() => {
    processedFiles.current = [];
    renderer.reset();
  }, [mcaFiles]);

  function trySetPalette(pal: string[]) {
    const str = processPalette(pal);
    try {
      renderer.set_palette(str);
      setPalette(pal);
    } catch (e) {
      console.error("failed to save palette", e);
      alert("failed to save palette" + (e as Error).message);
    } finally {
      setEditingPalette(false);
    }
  }

  function resetPalette() {
    renderer.reset_palette();
    setPalette(DEFAULT_PALETTE);
    setEditingPalette(false);
  }

  return (
    <>
      {
        <div
          className={
            "m-4 flex flex-col mx-auto justify-center content-center items-center"
          }
        >
          <div>
            <button
              className={"btn"}
              disabled={processing}
              onClick={selectDirectory}
            >
              Select directory
            </button>
            {numFiles == 0 && "No mca files selected"}
            {numFiles > 0 && String(numFiles) + " mca files selected"}
            {filteredFiles.length > 0 && (
              <div>
                <RangeSelectorThing
                  label={"Filter region x:"}
                  range={rangeX}
                  selectedRange={selectedRangeX}
                  setSelectedRange={setSelectedRangeX}
                ></RangeSelectorThing>
                <RangeSelectorThing
                  label={"Filter region z:"}
                  range={rangeZ}
                  selectedRange={selectedRangeZ}
                  setSelectedRange={setSelectedRangeZ}
                ></RangeSelectorThing>
                <button
                  disabled={filteredFiles.length == 0 || processing}
                  className={"btn"}
                  onClick={startProcessing}
                >
                  {filteredFiles.length > 0
                    ? "Render " + String(filteredFiles.length) + " regions"
                    : "No regions found"}{" "}
                </button>
                <button
                  className={"btn"}
                  disabled={editingPalette}
                  onClick={() => setEditingPalette(true)}
                >
                  Edit palette
                </button>
                <button className={"btn"} onClick={resetPalette}>
                  Reset palette
                </button>
              </div>
            )}
          </div>
          {editingPalette && (
            <PalettePicker
              currentPalette={palette}
              onSavePalette={trySetPalette}
              cancel={() => setEditingPalette(false)}
            ></PalettePicker>
          )}
        </div>
      }
      {processing && (
        <div
          className={
            "w-1/2 mx-auto h-50 justify-center content-center align-middle"
          }
        >
          <ProgressThing
            completed={progress.completed}
            total={progress.total}
          ></ProgressThing>
        </div>
      )}
      <div className={"mt-8 flex items-center justify-center min-w-0 w-full"}>
        <img className={"max-w-full"} ref={imgRef} alt={""} />
      </div>
    </>
  );
}

export default HeatmapApp;
