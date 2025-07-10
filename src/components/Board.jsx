import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  IMAGE: "image",
};

function DraggableImage({ id, src, x, y, setImages }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { id, x, y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover(item, monitor) {
      if (!monitor.isOver({ shallow: true })) return; 

      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const newX = Math.max(0, item.x + delta.x);
      const newY = Math.max(0, item.y + delta.y);

      if (newX !== x || newY !== y) {
        setImages((images) =>
          images.map((img) =>
            img.id === item.id ? { ...img, x: newX, y: newY } : img
          )
        );
      }
    },
  });

  return (
    <img
      ref={(node) => drag(drop(node))}
      src={src}
      alt=""
      className={`draggable-image ${isDragging ? "dragging" : ""}`}
      style={{ left: x, top: y, position: "absolute" }}
      draggable={false}
    />
  );
}

function Board({ images, setImages }) {
  if (images.length === 0) {
    return (
      <div className="board empty-board">
        <p>Your Aura Board is empty. Upload some images!</p>
      </div>
    );
  }

  return (
    <div className="board">
      {images.map(({ id, src, x, y }) => (
        <DraggableImage
          key={id}
          id={id}
          src={src}
          x={x}
          y={y}
          setImages={setImages}
        />
      ))}
    </div>
  );
}

export default Board;
