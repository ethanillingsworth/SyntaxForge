// import { useEffect, useMemo, useState } from "react";
// import { Category } from "../firebase/Firebase";

import { useEffect, useState } from "react";
import { useUser } from "../Global";
import { Category } from "../firebase/Firebase";

function Top() {
    return (
        <a
            href="/home"
            className="flex flex-row gap-3 min-h-16 place-items-center text-white hover:gradient-text"
        >
            <img className="h-6 rounded" src="/logo.png" alt="SyntaxForge" />
            <h2 className="text-base">SyntaxForge</h2>
        </a>
    );
}

function Group({ heading, children }) {
    return (
        <ul className="group">
            <h2>
                <li>{heading}</li>
            </h2>
            {children}
        </ul>
    );
}

function Menu({ heading, children, style = null }) {
    return (
        <ul className="menu">
            <li style={style}>{heading}</li>
            <ul className="submenu">{children}</ul>
        </ul>
    );
}

function Item({ name, link = null, style = null }) {
    if (link) {
        return (
            <a href={link}>
                <li style={style}>{name}</li>
            </a>
        );
    } else {
        return <li style={style}>{name}</li>;
    }
}

export default function Sidebar() {
    const [courses, setCourses] = useState({});
    // const [playgrounds, setPlaygrounds] = useState({});
    const [username, setUsername] = useState("");
    const [cates, setCates] = useState([]);

    const user = useUser();

    useEffect(() => {
        if (!user) return;

        user.get("public").then((data) => {
            setCourses(data.courses || {});
            setUsername(data.username);
        });

        // user.get("private").then((data) => {
        //     setPlaygrounds(data.playgrounds || {});
        // });

        Category.getAll().then((l) => {
            setCates(l);
            console.log(l);
        });
    }, [user]);

    // function createPlayground() {
    //     const name = prompt("Playground Name:");
    //     if (name) {
    //         const id = name.replaceAll(" ", "-").toLowerCase();
    //         user.set("private", {
    //             playgrounds: {
    //                 [id]: {
    //                     name: name,
    //                 },
    //             },
    //         }).then(() => {
    //             window.location.href = "/playgrounds/" + id;
    //         });
    //     }
    // }

    return (
        <nav>
            <Top />
            <Group heading="Personal">
                <Item name="Your Profile" link={`/user/@${username}`} />

                <Menu heading="Your Courses">
                    {Object.keys(courses).map((key) => {
                        const data = courses[key];
                        if (data.added) {
                            return (
                                <Item
                                    name={
                                        data.nickname
                                            ? data.nickname
                                            : key.replaceAll("-", " ")
                                    }
                                    key={key}
                                    link={`/${key}`}
                                />
                            );
                        }
                    })}
                    {/* <Item name="Find Courses" link="/courses" /> */}
                </Menu>
                {/* <Menu heading="Playgrounds">
                    {Object.keys(playgrounds || {}).map((key) => {
                        const data = playgrounds[key];
                        return (
                            <a href={`/playgrounds/${key}`} key={key}>
                                <li>{data.name}</li>
                            </a>
                        );
                    })}
                    <li onClick={createPlayground}>New Playground</li>
                </Menu> */}
            </Group>

            <Group heading="Courses">
                {cates.map((category) => {
                    if (!category.hidden) {
                        return (
                            <Menu
                                heading={category.name}
                                style={{
                                    "--color": `${category.color || "#fc483f"}4d`,
                                }}
                                key={category.id}
                            >
                                {category.courses.map((v) => {
                                    if (!v.hidden)
                                        return (
                                            <Item
                                                name={v.name}
                                                link={`/${v.id}`}
                                                key={v.id}
                                                style={{
                                                    "--color": `${v.color || "#fc483f"}4d`,
                                                }}
                                            />
                                        );
                                })}
                            </Menu>
                        );
                    }
                })}
            </Group>

            {/* <Group heading="Quick Links">
                <ul className="menu">
                    <a href="/courses">
                        <li>Available Courses</li>
                    </a>
                    <ul className="submenu">
                        {cates.map((category) => {
                            if (!category.hidden) {
                                return (
                                    <a
                                        href={`/courses#${category.id}`}
                                        key={category.id}
                                    >
                                        <li
                                            style={{
                                                "--color": `${category.color || "#fc483f"}4d`,
                                            }}
                                        >
                                            {category.name}
                                        </li>
                                    </a>
                                );
                            }
                        })}
                    </ul>
                </ul>
            </Group> */}
        </nav>
    );
}
