import { ManagedWorker } from "./ManagedWorker.ts";

type Task = {
  file: File;
  resolve: (res: BigInt64Array) => void;
  reject: (err: Error) => void;
};

export class WorkerPool {
  private freeWorkers: ManagedWorker[] = [];
  private pendingTasks: Task[] = [];
  private closed = false;

  constructor(numWorkers: number) {
    if (numWorkers <= 0) {
      throw new Error("numWorkers must be positive");
    }

    for (let i = 0; i < numWorkers; i++) {
      this.freeWorkers.push(new ManagedWorker());
    }
  }

  processNext() {
    if (this.pendingTasks.length > 0 && this.freeWorkers.length > 0) {
      const worker = this.freeWorkers.shift()!;
      const task = this.pendingTasks.shift()!;

      worker
        .extractTimes(task.file)
        .then((result) => {
          task.resolve(result);
        })
        .catch((err) => {
          task.reject(err);
        })
        .finally(() => {
          if (self.closed) {
            worker.free();
          } else {
            this.freeWorkers.push(worker);
          }
          this.processNext();
        });
    }
  }

  enqueue_extraction(file: File): Promise<BigInt64Array> {
    if (this.closed) {
      throw new Error("pool closed");
    }

    return new Promise((resolve, reject) => {
      this.pendingTasks.push({
        resolve: resolve,
        reject: reject,
        file: file,
      });
      this.processNext();
    });
  }

  free() {
    if (!this.closed) {
      this.closed = true;
      this.freeWorkers.forEach((worker: ManagedWorker) => {
        worker.free();
      });
      this.freeWorkers = [];
    }
  }
}
