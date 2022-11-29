import React from "react";
import Code from "./Code";
import List from "./List";
import Paragraph from "./Paragraph";
import Title from "./Title";

export default function ArticlePost(props) {
    const { myNode } = props;
    return (
        <div className="bg-white ring-2 ring-gray-100 rounded shadow-lg w-full h-full p-2">
            {myNode.map((item) => {
                // 标题
                if (item.type === "title") {
                    return (
                        <Title titleType={item.titleType} value={item.value} />
                    );
                }
                // 段落
                if (item.type === "parallel") {
                    return <Paragraph value={item.value} />;
                }
                // 代码块
                if (item.type === "code") {
                    return <Code value={item.value} />;
                }
                // 图片资源
                if (item.type === "asset") {
                    return (
                        <img
                            alt={item.alt}
                            src={item.src}
                            className="select-none border"
                        />
                    );
                }
                // 列表
                if (item.type === "list") {
                    return <List listType={item.listType} value={item.value} />;
                }
                return void 0;
            })}
        </div>
    );
}
