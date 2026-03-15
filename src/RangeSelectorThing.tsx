import NumberSpinner from "./NumberSpinner.tsx";

import type { Range } from "./util.ts";
import type { ReactNode } from "react";

type Props = {
  label: ReactNode;
  range: Range;
  selectedRange: Range;
  setSelectedRange: (r: Range) => void;
};

function RangeSelectorThing({
  label,
  range,
  selectedRange,
  setSelectedRange,
}: Props) {
  function onUpdateMin(n: number) {
    setSelectedRange({ ...selectedRange, min: n });
  }

  function onUpdateMax(n: number) {
    setSelectedRange({ ...selectedRange, max: n });
  }

  function reset() {
    setSelectedRange(range);
  }

  return (
    <>
      <div className={"flex flex-row m-4 gap-10 align-middle justify-center"}>
        <div className={"flex flex-col items-center justify-end"}>
          <div>{label}</div>
          <div
            className={
              "p-0 text-indigo-400 font-bold cursor-pointer underline decoration-dotted"
            }
            onClick={reset}
          >
            reset
          </div>
        </div>
        <div className={"flex flex-col items-start"}>
          <span>min</span>
          <NumberSpinner
            min={range.min}
            max={selectedRange.max}
            value={selectedRange.min}
            onUpdate={onUpdateMin}
          ></NumberSpinner>
        </div>
        <div className={"flex flex-col items-start"}>
          <span>max</span>
          <NumberSpinner
            min={selectedRange.min}
            max={range.max}
            value={selectedRange.max}
            onUpdate={onUpdateMax}
          ></NumberSpinner>
        </div>
      </div>
    </>
  );
}

export default RangeSelectorThing;
