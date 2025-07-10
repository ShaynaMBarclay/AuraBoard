function Board({ images }) {
    return (
        <div className="board">
            {images.length === 0 ? (
               <p>Your Aura Board is empty. Upload some images!</p>
            ) : (
                <div className="image-grid">
                    {images.map((src, idx) => (
                       <img key={idx} src={src} alt={`Mood ${idx}`} className="board-image" />
                     ))}
                 </div>
                )}
              </div>
             );
           }       

export default Board;