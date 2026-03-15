import init, { McaProcessor } from "../pkg";
import { asError } from "./util.ts";

export type ResultMessage =
  | {
      kind: "resultOk";
      inhabitedTimes: BigInt64Array;
    }
  | {
      kind: "resultErr";
      error: string;
    };

export type TaskMessage = {
  kind: "task";
  mcaFile: File;
};

let worker: McaProcessor;
let isInitialized = false;

init().then(() => {
  worker = new McaProcessor();
  isInitialized = true;
});

function doPostMessage(
  msg: ResultMessage,
  opt?: WindowPostMessageOptions,
): void {
  postMessage(msg, opt);
}

async function handleMessage(msg: TaskMessage) {
  switch (msg.kind) {
    case "task": {
      if (!isInitialized) {
        console.error("received task, but not initialized yet");
        return;
      }
      const ab = await msg.mcaFile.arrayBuffer();

      try {
        const res = worker.extract_region_data(new Uint8Array(ab));
        doPostMessage(
          { kind: "resultOk", inhabitedTimes: res },
          { transfer: [res.buffer] },
        );
      } catch (error) {
        doPostMessage({ kind: "resultErr", error: asError(error).message });
      }

      break;
    }
    default:
      console.error("unexpected message", msg);
  }
}

let handlingMessage = false;
onmessage = (event: MessageEvent<TaskMessage>) => {
  // no runtime guarantee that it not MessageEvent<ExplodingMysteryType>

  if (handlingMessage) {
    console.error(
      "received message while already handling another message (dropped, programmer error)",
    );
    return;
  }
  handlingMessage = true;

  handleMessage(event.data).finally(() => (handlingMessage = false));
};
