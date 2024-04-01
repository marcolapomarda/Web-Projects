import { useEffect,useState } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            //fetch('http://localhost:8000/blogs')
            fetch(url)
                .then(res => {
                    if(!res.ok) throw Error('Oops! Could not fetch data from the server.');
                    return res.json();
                })
                .then(data => {
                    setData(data);
                    setIsPending(false);
                    setError(null);
                })
                .catch(err => {
                    setError(err.message);
                    setData(null);
                });
        }, 300);
    }, [url]);

    return { data, isPending, error }
}

export default useFetch;