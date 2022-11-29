import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Article from "../components/Article";
import { renderBlockNode } from "../utils/myFunction";

const BeautifyScroll = styled.div`
    transition: all 500ms;
    ::-webkit-scrollbar {
        width: 0.5rem;
        height: 0.5rem;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 0.3125rem;
        :hover {
            background-color: gray;
        }
    }
    ::-webkit-scrollbar-button {
        display: none;
    }
`;

export default function App() {
    // const [inputText, setInputText] = useState(
    //     "# Markdown 编辑器渲染示例\n## introduction\n该`example`采用`react`+css框架开发，支持大部分 Markdown 语法，该编辑器还在开发中，**可能存在多种BUG，望\n**\n本项目已上传`github`，感谢大家的支持\n1. 列表渲染\n2. 列表渲染\n- 列表渲染\n- 列表渲染\n- 列表渲染"
    // );
    const [inputText, setInputText] = useState("");
    const [myNode, setMyNode] = useState([]);
    useEffect(() => {
        setMyNode(renderBlockNode(inputText.split("\n")));
    }, [inputText]);

    return (
        <BeautifyScroll className="w-full min-h-screen flex">
            <div className="w-full grow flex flex-row">
                {/* 输入 markdown文本 板块 */}
                <div className="w-1/2 grow m-2 flex flex-col">
                    <label className="text-center font-bold text-lg">
                        Markdown Editor
                    </label>
                    <textarea
                        className="h-full p-2 resize-none outline-none rounded border-2 border-teal-500 focus:border-lime-500 duration-500"
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                        }}
                    />
                </div>
                {/* 渲染板块 */}
                <div className="w-1/2 m-2 flex flex-col">
                    <label className="text-center font-bold text-lg">
                        Markdown Effect
                    </label>
                    <Article myNode={myNode} />
                </div>
            </div>
        </BeautifyScroll>
    );
}
