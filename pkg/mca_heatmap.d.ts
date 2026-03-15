/* tslint:disable */
/* eslint-disable */

export class HeatmapRenderer {
  free(): void;
  [Symbol.dispose](): void;
  constructor();
  /**
   * Renders a heatmap using the stored region data. Does not clear the data.
   */
  render_all(): Uint8Array;
  /**
   * Renders a heatmap using the stored region data, filtered by the specified region coordinate ranges (inclusive).
   * Does not clear the data.
   */
  render_range(
    x_range_min: number,
    x_range_max: number,
    z_range_min: number,
    z_range_max: number,
  ): Uint8Array;
  /**
   * Resets the processor and discards stored region data. Does not reset the palette.
   */
  reset(): void;
  /**
   * Resets palette to the default palette.
   */
  reset_palette(): void;
  /**
   * Specify a custom color palette. Colon-separated list of at least three RGB hex color codes with no whitespace and no '#'.
   * The first color will determine the background color and the remaining colors will
   * determine the gradient from "cold" to "hot" (lower to higher inhabited time values).
   * "14001E:1E0997:AC00D9:D90000:D9A600:FFFFFF" reproduces the default palette.
   */
  set_palette(palette_string: string): void;
  /**
   * Submit inhabited time data to be stored in the renderer.
   */
  submit_data(
    region_x: number,
    region_z: number,
    inhabited_times: BigInt64Array,
  ): void;
}

export class McaProcessor {
  free(): void;
  [Symbol.dispose](): void;
  extract_region_data(data: Uint8Array): BigInt64Array;
  constructor();
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_heatmaprenderer_free: (a: number, b: number) => void;
  readonly __wbg_mcaprocessor_free: (a: number, b: number) => void;
  readonly heatmaprenderer_new: () => number;
  readonly heatmaprenderer_render_all: (
    a: number,
  ) => [number, number, number, number];
  readonly heatmaprenderer_render_range: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
  ) => [number, number, number, number];
  readonly heatmaprenderer_reset: (a: number) => void;
  readonly heatmaprenderer_reset_palette: (a: number) => void;
  readonly heatmaprenderer_set_palette: (
    a: number,
    b: number,
    c: number,
  ) => [number, number];
  readonly heatmaprenderer_submit_data: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
  ) => [number, number];
  readonly mcaprocessor_extract_region_data: (
    a: number,
    b: number,
    c: number,
  ) => [number, number, number, number];
  readonly mcaprocessor_new: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
