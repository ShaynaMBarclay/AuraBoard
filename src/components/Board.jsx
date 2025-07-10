import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  IMAGE: "image",
};

function DraggableImage({ id, src, x, y, updateImage }) {
  const offsetRef = useRef({ x: 0, y: 0 });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { id, offsetRef },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    
  });

  function handleDragStart(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  return (
    <img
      ref={drag}
      src={src}
      alt=""
      className={`draggable-image ${isDragging ? "dragging" : ""}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: "grab",
        userSelect: "none",
        opacity: isDragging ? 0.5 : 1,
      }}
      draggable={false}
      onMouseDown={handleDragStart}
    />
  );
}

function Board({ images, updateImage }) {
  const boardRef = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover(item, monitor) {
      if (!boardRef.current) return;

      const boardRect = boardRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const newX = Math.max(0, clientOffset.x - boardRect.left - item.offsetRef.current.x);
      const newY = Math.max(0, clientOffset.y - boardRect.top - item.offsetRef.current.y);

      updateImage(item.id, { x: newX, y: newY });
    },
  });

  return (
    <div
      ref={boardRef}
      className="board"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div ref={drop} style={{ width: "100%", height: "100%", position: "relative" }}>
        {images.length === 0 ? (
          <p>Your Aura Board is empty. Upload some images!</p>
        ) : (
          images.map(({ id, src, x, y }) => (
            <DraggableImage
              key={id}
              id={id}
              src={src}
              x={x}
              y={y}
              updateImage={updateImage}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Board;
