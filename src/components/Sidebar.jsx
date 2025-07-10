function Sidebar({ onImageUpload }) {
    function handleFileChange(e) {
        const files = Array.from(e.target.files);
        const imageURLs = files.map(file => URL.createObjectURL(file));
        onImageUpload(imageURLs);
    }

    return (
        <aside className="sidebar">
            <h2>Upload Images</h2>
            <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            />
        </aside>
    );
}
export default Sidebar;