import React from "react";
import InlineStyleRenderer from "./InlineStyleRenderer";

export default function Title(props) {
    const { titleType, value } = props;
    return (
        <div
            className={`font-bold cursor-default truncate hover:text-teal-500 duration-300
            ${
                titleType === "first" &&
                "text-3xl pl-4 mb-4 border-l-4 border-teal-500"
            }
            ${titleType === "second" && "text-2xl"}
            ${titleType === "third" && "text-xl"}
            ${titleType === "default" && "text-lg"}`}
        >
            <InlineStyleRenderer value={value} />
        </div>
    );
}
