import { useDrop } from 'react-dnd';

function Trashcan({ setImages }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    drop: (item) => {
      setImages(images => images.filter(img => img.id !== item.id));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`trashcan ${isOver ? 'trashcan-over' : ''}`}
      title="Drag images here to delete"
    >
      🗑️
    </div>
  );
}

export default Trashcan;
