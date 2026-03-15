import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  min: number;
  max: number;
  value: number;
  onUpdate: (n: number) => void;
};

function NumberSpinner({ min, max, value, onUpdate }: Props) {
  // the reinvented wheel goes round and round

  const inputRef = useRef<HTMLInputElement>(null);
  const [displayString, setDisplayString] = useState(String(value));

  function clamp(value: number) {
    return Math.min(max, Math.max(min, value));
  }

  function stepFn(n: number): () => void {
    return () => {
      const clamped = clamp(value + n);
      setDisplayString(String(clamped));
      onUpdate(clamped);
    };
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (/^-?\d*$/.test(e.target.value)) {
      setDisplayString(e.target.value);
    }
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    submitNewValue(e.target.value);
  }

  function submitNewValue(value: string) {
    if (inputRef.current) {
      const n = parseInt(value);
      if (!Number.isNaN(n)) {
        const clamped = clamp(n);
        setDisplayString(String(clamped));
        onUpdate(clamped);
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submitNewValue((e.target as HTMLInputElement).value);
    }
  }

  useEffect(() => {
    setDisplayString(String(value));
  }, [value]);

  return (
    <div className={"inline-flex flex-row justify-center"}>
      <button
        disabled={value <= min}
        className={"spinner-btn spinner-btn-l"}
        onClick={stepFn(-1)}
      >
        -
      </button>
      <input
        onKeyDown={handleKeyDown}
        value={displayString}
        onBlur={handleBlur}
        onChange={handleChange}
        ref={inputRef}
        className={"spinner-input"}
        type={"text"}
        inputMode={"numeric"}
      />
      <button
        disabled={value >= max}
        className={"spinner-btn spinner-btn-r"}
        onClick={stepFn(1)}
      >
        +
      </button>
    </div>
  );
}

export default NumberSpinner;
