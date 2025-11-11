import Editor from "../components/Editor";

export default function Home() {

    const content = localStorage.getItem("playground") || null
    return (
        <>
                
            <Editor defaultCode={content} playground={true}></Editor>

        </>
    );
}