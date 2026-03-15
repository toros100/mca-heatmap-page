import clsx from "clsx";
type Props = {
  hexCode: string;
  editing: boolean;
  draggable: boolean;
};

function ColorSquare(props: Props) {
  return (
    <div
      className={clsx(
        "w-12 h-12 mr-2 rounded-sm",
        props.editing && "border-1 border-neutral-900 ring-2 ring-white",
        props.draggable && "cursor-move",
        !props.draggable && "cursor-pointer",
      )}
      style={{ background: props.hexCode, boxShadow: "1 1" }}
    ></div>
  );
}

export default ColorSquare;
