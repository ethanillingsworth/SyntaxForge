import { useState, useEffect } from "react";

export default function Header() {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 1); // triggers when user scrolls down
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={scrolled ? "p-4" : "p-6"}>
            <a className="gradient-text font-bold p-0 my-auto" href="/">SyntaxForge</a>
            <a href="/courses">Courses</a>
            <a href="/playground">Playground</a>

            <div className="ml-auto row">
                <a href="/login" className="gradient-bg text-white px-4 font-bold">Login</a>
            </div>

        </header>
    );
}