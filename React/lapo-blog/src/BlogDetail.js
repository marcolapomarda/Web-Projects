import { useNavigate, useParams } from "react-router-dom";
import useFetch from "./useFetch";
import { useState } from "react";

const BlogDetail = () => {
    const { id } = useParams();
    const { data: blog, isPending, error } = useFetch(`http://localhost:8000/blogs/${id}`);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    
    const handleDelete = () => {
        setIsDeleting(true);
        setTimeout(() => {
            fetch(`http://localhost:8000/blogs/${id}`, {
                method: 'DELETE',
            }).then(() => {
                console.log('Blog successfully deleted');
                setIsDeleting(false);
                navigate('/');
            })
        }, 800);
    }

    return (
        <div className="blog-detail">
            {error && <div>Error: {error}</div>}
            {!error && isPending && <div>Loading...</div>}
            {blog &&
                <div className="blog-detail-content">
                    <h2>{ blog.title }</h2>
                    <p>Written by: { blog.author }</p>
                    <p className="blog-detail-content-body">{ blog.body }</p>
                    <button onClick={handleDelete}>Delete Blog</button>
                    {isDeleting && <p>Deleting Blog...</p>}
                </div>
            }    
        </div>
    );
}
 
export default BlogDetail;