import { useCallback, useState } from "react";
import PopupMenu from "../components/PopupMenu";

export class PopupMenuBuilder {
    constructor() {
        this.template = {};
    }

    addInput(id, label, value) {
        this.template[id] = {
            type: "input",
            label: label,
            value: value,
        };
        return this; // Allows chaining!
    }
    addNumber(id, label, units, value) {
        this.template[id] = {
            type: "input",
            label: label,
            units: units,
            value: value,
        };
        return this; // Allows chaining!
    }

    addText(id, label) {
        this.template[id] = {
            type: "text",
            label: label,
        };
        return this; // Allows chaining!
    }

    addSelect(id, label, options, value) {
        this.template[id] = {
            type: "select",
            label: label,
            options: options,
            value: value,
        };
        return this;
    }

    addButton(id, label) {
        this.template[id] = {
            type: "button",
            label: label,
        };
        return this;
    }

    change(id, key, value) {
        this.template[id] = {
            [key]: value,
        };
    }

    build() {
        return this.template;
    }
}

// A helper function to kick off the builder smoothly
export const createMenu = () => new PopupMenuBuilder();

export function usePopup(template, submitFunction = null) {
    const [pos, setPos] = useState({});
    const [show, setShow] = useState(false);

    const open = useCallback((e) => {
        setPos({
            x: e.pageX,
            y: e.pageY,
        });
        setShow(true);
    }, []);

    const element = (
        <PopupMenu
            position={pos}
            dataTemplate={template}
            showCondition={show}
            submitAction={submitFunction}
            hideSubmit={!submitFunction}
            closeAction={setShow}
        />
    );

    return { open, element };
}
