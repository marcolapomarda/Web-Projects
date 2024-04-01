import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Create = () => {
    const [title, setTitle] = useState('Enter a blog title');
    const [body, setBody] = useState('Enter a blog body');
    const [author, setAuthor] = useState('Lapo');
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, body, author };
        setIsPending(true);
        console.log('Adding Blog...');
        
        setTimeout(() => {
            fetch('http://localhost:8000/blogs', {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(blog)
            }).then(() => {
                console.log('New blog successfully added!');
                setIsPending(false);
                navigate('/');
            })
        }, 800);
    }

    return (
        <div className="create">
            <h2>Add a New Blog</h2>
            <form onSubmit={handleSubmit}>
                <label>Blog title: </label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Blog body: </label>
                <textarea
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                ></textarea>
                <label>Blog author: </label>
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                >
                    <option value="Lapo">Lapo</option>
                    <option value="Mary">Mary</option>
                </select>
                {!isPending && <button className="add-blog">Add Blog</button>}
                {isPending && <button disabled>Adding Blog...</button>}
            </form>
        </div>
    );
}
 
export default Create;