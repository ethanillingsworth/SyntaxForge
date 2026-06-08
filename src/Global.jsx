import { useEffect, useState } from "react";
import { Course, Unit, User } from "./firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/init";

export function useShortcut({ key, ctrl, shift, alt, meta }, callback) {
    useEffect(() => {
        const handler = (e) => {
            if (
                e.key.toLowerCase() === key.toLowerCase() &&
                (!ctrl || e.ctrlKey) &&
                (!shift || e.shiftKey) &&
                (!alt || e.altKey) &&
                (!meta || e.metaKey)
            ) {
                e.preventDefault();
                callback(e);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [key, ctrl, shift, alt, meta, callback]);
}

export function useForceLogin() {
    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = "/login";
            }
        });
    }, []);
}

export function useNextLesson(courseId, unitNumber, lessonId, callback) {
    useEffect(() => {
        const course = new Course(courseId);

        course.getUnitFromNumber(unitNumber).then((v) => {
            const unit = new Unit(v.id);
            unit.getNextLesson(lessonId).then((data) => {
                callback(data);
            });
        });
    }, [callback, courseId, lessonId, unitNumber]);
}

export function useUser() {
    /** @type {[User, Function]} */
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                return;
            }

            setUser(new User(firebaseUser.uid));
        });

        return unsub;
    }, []);

    return user;
}

export function useAdmin() {
    /** @type {[boolean, Function]} */
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) return;
            const u = new User(user.uid);
            return u.admin().then((status) => {
                setAdmin(status);
            });
        });
        return unsub;
    }, []);
    return admin;
}

export function useTitle(title) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}

export function formatNumber(num) {
    if (num >= 1000000000) {
        // Divide by 1B and fix to 1 decimal place if it's not a whole number
        const formatted = (num / 1000000000).toFixed(1);
        return formatted.endsWith(".0")
            ? formatted.slice(0, -2) + "B"
            : formatted + "B";
    }
    if (num >= 1000000) {
        // Divide by 1M and fix to 1 decimal place if it's not a whole number
        const formatted = (num / 1000000).toFixed(1);
        return formatted.endsWith(".0")
            ? formatted.slice(0, -2) + "M"
            : formatted + "M";
    }

    if (num >= 1000) {
        // Divide by 1K and fix to 1 decimal place
        const formatted = (num / 1000).toFixed(1);
        return formatted.endsWith(".0")
            ? formatted.slice(0, -2) + "K"
            : formatted + "K";
    }

    return num.toString();
}

export const capitalize = (str) => {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
export const stringToId = (str) => {
    return str
        .toLowerCase()
        .trim()
        .normalize("NFD") // Decomposes combined characters (like accented letters)
        .replace(/[\u0300-\u036f]/g, "") // Removes the accent marks
        .replace(/[^\w\s-]/g, "") // Removes all non-word chars (except spaces and hyphens)
        .replace(/[\s_-]+/g, "-") // Replaces spaces, underscores, or multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, ""); // Trims hyphens from the start and end
};

export function toSnakeCase(str) {
    return (
        str
            // 1. Insert an underscore before any capital letters (handles camelCase/PascalCase)
            .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
            // 2. Replace spaces, dashes, or consecutive special characters with a single underscore
            .replace(/[\s-]+/g, "_")
            // 3. Strip out any remaining special punctuation characters
            .replace(/[^a-zA-Z0-9_]/g, "")
            // 4. Convert the entire string to lowercase
            .toLowerCase()
    );
}

export function toCamelCase(str) {
    return (
        str
            // 1. Replace dashes, underscores, or spaces followed by a character with a capitalized character
            .replace(/[-_\s]+(.)?/g, (match, ch) =>
                ch ? ch.toUpperCase() : "",
            )
            // 2. Strip out any remaining special punctuation characters
            .replace(/[^a-zA-Z0-9]/g, "")
            // 3. Ensure the very first character of the string is lowercase
            .replace(/^(.)/, (match, ch) => ch.toLowerCase())
    );
}
