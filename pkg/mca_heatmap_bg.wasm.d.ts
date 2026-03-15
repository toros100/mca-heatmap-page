/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const __wbg_heatmaprenderer_free: (a: number, b: number) => void;
export const __wbg_mcaprocessor_free: (a: number, b: number) => void;
export const heatmaprenderer_new: () => number;
export const heatmaprenderer_render_all: (
  a: number,
) => [number, number, number, number];
export const heatmaprenderer_render_range: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
) => [number, number, number, number];
export const heatmaprenderer_reset: (a: number) => void;
export const heatmaprenderer_reset_palette: (a: number) => void;
export const heatmaprenderer_set_palette: (
  a: number,
  b: number,
  c: number,
) => [number, number];
export const heatmaprenderer_submit_data: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
) => [number, number];
export const mcaprocessor_extract_region_data: (
  a: number,
  b: number,
  c: number,
) => [number, number, number, number];
export const mcaprocessor_new: () => number;
export const __wbindgen_externrefs: WebAssembly.Table;
export const __externref_table_dealloc: (a: number) => void;
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_realloc: (
  a: number,
  b: number,
  c: number,
  d: number,
) => number;
export const __wbindgen_start: () => void;
