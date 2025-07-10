import { useDrop } from "react-dnd";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

function Trashcan({ setImages, user }) {
  const [{ isOver }, drop] = useDrop({
    accept: "image",
    drop: async (item) => {
      try {
        if (user) {
          const docRef = doc(db, "users", user.uid, "images", item.id);
          await deleteDoc(docRef);
        }

        const storageRef = ref(storage, `images/${item.id}`);
        await deleteObject(storageRef);
      } catch (error) {
        console.error("Error deleting image:", error);
      }

      setImages((images) => images.filter((img) => img.id !== item.id));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`trashcan ${isOver ? "trashcan-over" : ""}`}
      title="Drag images here to delete"
    >
      🗑️
    </div>
  );
}

export default Trashcan;
