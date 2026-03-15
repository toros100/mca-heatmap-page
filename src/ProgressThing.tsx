type Props = {
  completed: number;
  total: number;
};
function ProgressThing({ completed, total }: Props) {
  const progress = total != 0 ? (completed / total) * 100 : 100;
  return (
    <div className={"flex flex-col w-full min-w-0 gap-2"}>
      <span className={"mx-auto"}>
        Processed {completed} out of {total} regions
      </span>
      <div className="flex w-full bg-neutral-600 rounded-xl h-4 border-1 border-neutral-900 items-center">
        <div
          className="bg-teal-500 h-3 rounded-xl border-r-2 border-teal-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressThing;
