import { HexColorPicker } from "react-colorful";
import { useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import ColorSquare from "./ColorSquare.tsx";

export type Color = {
  key: string;
  hexCode: string;
};

const DEFAULT_COLOR = "#FFFFFF";

type Props = {
  currentPalette: string[];
  onSavePalette: (p: string[]) => void;
  cancel: () => void;
};

function PalettePicker({ onSavePalette, currentPalette, cancel }: Props) {
  const [pickerColor, setPickerColor] = useState<string>("#FF00FF");
  const [things, setThings] = useState<Color[]>(
    currentPalette.map((code, idx) => ({ key: String(idx), hexCode: code })),
  );
  const [reorderEnabled, setReorderEnabled] = useState(false);

  // key of the color we are currently editing, if any, otherwise null
  const [editingColor, setEditingColor] = useState<string | null>(null);

  const groupRef = useRef<null | HTMLUListElement>(null);

  function toggleReorder() {
    setReorderEnabled((v) => !v);
  }

  function addColor() {
    const newKey = Math.max(...things.map((col) => parseInt(col.key))) + 1;
    const newCol: Color = { key: newKey.toString(), hexCode: DEFAULT_COLOR };
    setThings((t) => [...t, newCol]);
  }

  function onItemClick(key: string, currentColor: string): () => void {
    return () => {
      if (!reorderEnabled && editingColor === null) {
        setEditingColor(key);
        setPickerColor(currentColor);
        setReorderEnabled(false);
      }
    };
  }

  function editingColorCancel() {
    setEditingColor(null);
  }

  function editingColorAccept() {
    if (editingColor) {
      setThings((prev) =>
        prev.map((col) => {
          if (col.key == editingColor) {
            return { key: col.key, hexCode: pickerColor };
          } else {
            return col;
          }
        }),
      );
      setEditingColor(null);
    }
  }

  function editingColorDelete() {
    if (editingColor) {
      if (things.length > 2) {
        setThings((prev) => prev.filter((col) => col.key !== editingColor));
      }
      setEditingColor(null);
    }
  }

  useEffect(() => {
    // shhh
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThings(
      currentPalette.map((code, idx) => ({ key: String(idx), hexCode: code })),
    );
  }, [currentPalette]);

  // todo make input usable
  return (
    <>
      <Reorder.Group
        axis={"x"}
        ref={groupRef}
        values={things}
        onReorder={setThings}
        className={
          "flex flex-row w-full px-8 h-16 m-2 items-end justify-center"
        }
      >
        {things.map((col) => (
          <Reorder.Item
            onClick={onItemClick(col.key, col.hexCode)}
            transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
            value={col}
            key={col.key}
            dragListener={reorderEnabled}
            dragConstraints={groupRef}
          >
            <ColorSquare
              draggable={reorderEnabled}
              editing={col.key == editingColor}
              hexCode={editingColor === col.key ? pickerColor : col.hexCode}
            ></ColorSquare>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div>
        <button
          className={"btn"}
          disabled={editingColor !== null}
          onClick={toggleReorder}
        >
          {reorderEnabled ? "Done" : "Reorder"}
        </button>
        <button
          className={"btn"}
          disabled={things.length >= 12}
          onClick={addColor}
        >
          Add Color
        </button>
        <button
          className={"btn"}
          onClick={() => onSavePalette(things.map((t) => t.hexCode))}
        >
          Save palette
        </button>
        <button className={"btn"} onClick={cancel}>
          Cancel
        </button>
      </div>
      <div
        hidden={editingColor === null}
        className={
          "flex flex-col items-center border-1 border-neutral-500 rounded-md p-6 pb-2 m-4"
        }
      >
        <HexColorPicker
          color={pickerColor}
          onChange={setPickerColor}
        ></HexColorPicker>
        <input
          type={"text"}
          disabled={true}
          className={"h-8 w-24 m-2 text-center bg-neutral-900 "}
          value={pickerColor}
        ></input>
        <div>
          <button className={"btn"} onClick={editingColorAccept}>
            Accept
          </button>
          <button
            className={"btn"}
            disabled={things.length <= 3}
            onClick={editingColorDelete}
          >
            Delete
          </button>
          <button className={"btn"} onClick={editingColorCancel}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default PalettePicker;
