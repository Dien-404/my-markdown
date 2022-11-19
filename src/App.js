import React, { useState } from "react";
import ArticlePost from "./ArticlePost";

export default function App() {
    const [sourseText, setSourseText] = useState("");
    return (
        <div className="w-full min-h-screen flex flex-row">
            {/* 输入框 */}
            <div className="w-1/2 p-2">
                <div className="text-3xl font-bold text-center select-none mb-4">
                    Editer
                </div>
                <textarea
                    className="w-full h-full resize-none outline-none p-2 rounded ring-2 ring-cyan-400 focus:ring-lime-500 duration-300"
                    value={sourseText}
                    onChange={(e) => {
                        setSourseText(e.target.value);
                    }}
                />
            </div>
            {/* 展示 markdown */}
            <div className="w-1/2 p-2 ml-3 overflow-hidden">
                <div className="text-3xl font-bold text-center select-none mb-4">
                    Effect
                </div>
                <ArticlePost value={sourseText.split("\n")} />
            </div>
        </div>
    );
}
