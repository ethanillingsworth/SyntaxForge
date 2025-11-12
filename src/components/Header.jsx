import { useState, useEffect } from "react";

export default function Header() {



    return (
        <header>
            <a className="gradient-text font-bold p-0 my-auto" href="/">SyntaxForge</a>
            <a href="/courses">Courses</a>
            <a href="/playground">Playground</a>

            <div className="ml-auto row">
                <a href="/login" className="gradient-bg text-white px-4 font-bold">Login</a>
            </div>

        </header>
    );
}