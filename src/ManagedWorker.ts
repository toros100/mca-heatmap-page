import type { ResultMessage, TaskMessage } from "./worker.ts";
import { asError } from "./util.ts";

type PendingResponse = {
  resolve: (res: BigInt64Array) => void;
  reject: (reason: string) => void;
};

export class ManagedWorker {
  private worker: Worker;
  private pendingResponse: PendingResponse | null = null;

  private dead = false;

  constructor() {
    this.worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });

    this.worker.onerror = (event: ErrorEvent) => {
      console.error("worker error", event.error);
      this.dead = true;
      this.worker.terminate();
      if (this.pendingResponse !== null) {
        this.rejectCurrentTask(event.error);
      }
    };

    this.worker.onmessageerror = (event) => {
      console.error("worker message error", event);
      this.dead = true;
      this.worker.terminate();
      if (this.pendingResponse !== null) {
        this.rejectCurrentTask(asError(event).message);
      }
    };

    this.worker.onmessage = (event: MessageEvent<ResultMessage>) => {
      if (this.pendingResponse === null) {
        console.error("unexpected message, no pending task", event);
        return;
      }
      switch (event.data.kind) {
        case "resultOk":
          this.resolveCurrentTask(event.data.inhabitedTimes);
          break;
        case "resultErr":
          this.rejectCurrentTask(event.data.error);
          break;
        default:
          console.error("unrecognized message", event);
      }
    };
  }

  doPostMessage(msg: TaskMessage, opt?: WindowPostMessageOptions) {
    this.worker.postMessage(msg, opt);
  }

  resolveCurrentTask(times: BigInt64Array): void {
    if (this.pendingResponse === null) {
      throw new Error("no pending response");
    }
    this.pendingResponse.resolve(times);
    this.pendingResponse = null;
  }

  rejectCurrentTask(error: string): void {
    if (this.pendingResponse === null) {
      throw new Error("no pending response");
    }
    this.pendingResponse.reject(error);
    this.pendingResponse = null;
  }

  async extractTimes(mcaFile: File): Promise<BigInt64Array> {
    if (this.pendingResponse !== null) {
      throw new Error("worker already in use");
    }
    if (this.dead) {
      throw new Error("worker is dead");
    }
    const promise = new Promise<BigInt64Array>((resolve, reject) => {
      this.pendingResponse = { resolve, reject };
    });
    this.doPostMessage({ kind: "task", mcaFile: mcaFile });
    return promise;
  }

  free() {
    this.dead = true;
    this.worker.terminate();
  }
}
