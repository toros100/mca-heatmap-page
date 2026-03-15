export type McaFile = {
  file: File;
  regionX: number;
  regionZ: number;
};

export type Range = {
  min: number;
  max: number;
};

export function parseFile(file: File): McaFile | null {
  // expecting file name like "r.x.z.mca", x and z integers

  const parts = file.name.split(".");

  if (parts.length != 4) {
    return null;
  }

  if (parts[3] !== "mca" || parts[0] !== "r") {
    return null;
  }

  const x = Number(parts[1]);
  const z = Number(parts[2]);

  if (!Number.isInteger(x) || !Number.isInteger(z)) {
    return null;
  }

  return {
    file: file,
    regionX: x,
    regionZ: z,
  };
}
function contains(range: Range, val: number): boolean {
  return range.min <= val && val <= range.max;
}

export function filterRange(
  files: McaFile[],
  rangeX: Range,
  rangeZ: Range,
): McaFile[] {
  return files.filter(
    (file) => contains(rangeX, file.regionX) && contains(rangeZ, file.regionZ),
  );
}
export function asError(e: unknown): Error {
  if (e instanceof Error) {
    return e;
  } else {
    return new Error("badly typed error: " + stringify(e));
  }
}

function stringify(e: unknown): string {
  if (e === undefined) {
    return "undefined";
  }
  try {
    return JSON.stringify(e);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return "unknown error (failed to stringify)";
  }
}
