import { InlineStyle, Title, Code, Asset, List, Parallel } from "./myObject";

// 渲染行内块标签对象
const renderInlineNode = (innerText) => {
    const innerNode = [];
    // 解决行内代码
    const handleCode = (str, italic = false, bold = false) => {
        const myCode = [];
        if (!italic && !bold) {
            while (str.match(/`.*?`/)) {
                let { 0: match, index } = str.match(/`.*?`/);
                myCode.push(
                    str.slice(0, index),
                    new InlineStyle({
                        italic,
                        bold,
                        code: true,
                        value: match.slice(1, match.length - 1),
                    })
                );
                str = str.slice(index + match.length);
            }
            myCode.push(str);
        } else {
            while (str.match(/`.*?`/)) {
                let { 0: match, index } = str.match(/`.*?`/);
                myCode.push(
                    new InlineStyle({
                        italic,
                        bold,
                        code: false,
                        value: str.slice(0, index),
                    }),
                    new InlineStyle({
                        italic,
                        bold,
                        code: true,
                        value: match.slice(1, match.length - 1),
                    })
                );
                str = str.slice(index + match.length);
            }
            myCode.push(
                new InlineStyle({
                    italic,
                    bold,
                    code: false,
                    value: str,
                })
            );
        }
        return myCode;
    };

    const handleItalicOrBold = (str) => {
        // 优先判断粗斜体类型
        let italic = false,
            bold = false,
            code = false,
            value;
        if (
            str.slice(0, 3) === "***" &&
            str.slice(0, 3) === str.slice(str.length - 3, str.length)
        ) {
            italic = true;
            bold = true;
            value = str.slice(3, str.length - 3);
        } else if (
            str.slice(0, 2) === "**" &&
            str.slice(0, 2) === str.slice(str.length - 2, str.length)
        ) {
            bold = true;
            value = str.slice(2, str.length - 2);
        } else if (str[0] === "*" && str[0] === str[str.length - 1]) {
            italic = true;
            value = str.slice(1, str.length - 1);
        }

        if (str.match(/`.*?`/)) {
            // 粗斜体内存在代码块
            return handleCode(value, italic, bold);
        } else {
            // 粗斜体内不存在代码块
            // 粗斜体
            if (italic && bold) {
                return new InlineStyle({
                    italic,
                    bold,
                    code,
                    value,
                });
            }
            // 粗体
            if (bold && !italic) {
                return new InlineStyle({
                    italic,
                    bold,
                    code,
                    value,
                });
            }
            // 斜体
            if (italic && !bold) {
                return new InlineStyle({
                    italic,
                    bold,
                    code,
                    value,
                });
            }
        }
    };

    while (innerText.match(/\*{1,3}.*?\*{1,3}/) || innerText.match(/`.*?`/)) {
        let str, // 处理行内代码
            matchItem, // 处理当前粗斜体匹配对象 -> 匹配的字符串
            matchIndex; // 处理当前粗斜体匹配对象 -> 匹配的下标
        if (innerText.match(/\*{1,3}.*?\*{1,3}/)) {
            // 存在 加粗、斜体情况
            let { 0: match, index } = innerText.match(/\*{1,3}.*?\*{1,3}/);
            matchItem = match;
            matchIndex = index;
            // 匹配字符串前的字符串出现的代码块
            str = innerText.slice(0, matchIndex);
        } else {
            // 不存在 加粗、斜体情况
            str = innerText; // 只需考虑代码块
            innerText = "";
        }
        // 优先处理代码块
        // 匹配不存在加粗、斜体样式中的代码块
        if (str.match(/`.*?`/)) {
            innerNode.push(handleCode(str));
        } else if (str === "") {
        } else {
            innerNode.push(str);
        }
        // 解决粗斜体以及判断是否合规
        if (matchItem) {
            // 存在粗斜体
            innerNode.push(handleItalicOrBold(matchItem));
            innerText = innerText.slice(matchIndex + matchItem.length);
        } else {
            break;
        }
    }
    if (innerText !== "") {
        innerNode.push(innerText);
    }
    return innerNode.flat(Infinity);
};

// 渲染块级标签对象
const renderBlockNode = (inputText) => {
    /*
        输入：
        inputText：Array数据结构
            1.从 textarea 标签中获取，根据 换行符"\n" 预处理分割
            2.从文件读取，读取时根据换行符预处理
        
        输出：
        myNode：Array数据结构，包含以下对象，具体对象数据查看 myObject.js 文件
            1.标题
            2.列表
            3.代码块
            4.图片资源
            5.段落
            6.尚未更新
    */
    const myNode = []; // 返回结果
    for (let i = 0; i < inputText.length; i++) {
        // 获取第 i 行字符串
        let str = inputText[i];

        // 一级标题
        if (str.match(/^#{1}\s/)) {
            myNode.push(
                new Title({
                    titleType: "first",
                    value: renderInlineNode(str.slice(2)),
                })
            );
            continue;
        }

        // 二级标题
        if (str.match(/^#{2}\s/)) {
            myNode.push(
                new Title({
                    titleType: "second",
                    value: renderInlineNode(str.slice(3)),
                })
            );
            continue;
        }

        // 三级标题
        if (str.match(/^#{3}\s/)) {
            myNode.push(
                new Title({
                    titleType: "third",
                    value: renderInlineNode(str.slice(4)),
                })
            );
            continue;
        }

        // 四级标题及以上
        if (str.match(/^#{4,6}\s/)) {
            let { 0: match } = str.match(/^#{4,6}\s/);
            myNode.push(
                new Title({
                    titleType: "default",
                    value: renderInlineNode(str.slice(match.length)),
                })
            );
            continue;
        }

        // 代码块
        if (str.match(/^```/) && i !== inputText.length - 1 && str[3] !== "`") {
            let begin = i;
            // 核实是否为代码块
            let flag = false;
            while (!inputText[++i].match(/^```/)) {
                // 如果只存在 单边```情况时，该```不属于代码块，属于段落
                if (i >= inputText.length - 1) {
                    flag = true;
                    break;
                }
            }
            // 不是代码块，取消代码块对象的生成，还原处理段落
            if (flag) {
                i = begin;
            } else {
                myNode.push(
                    new Code({
                        codeType: str.substring(3),
                        value: inputText.slice(begin + 1, i),
                    })
                );
                continue;
            }
        }

        // 资源
        // 图片，后续可能更新音频
        if (str.match(/^!\[.{0,}\]\(.{0,}\)$/)) {
            let img = str.match(/^!\[.{0,}\]\(.{0,}\)$/)[0];
            // 获取图片资源注释
            let alt = img.match(/\[.*?\]/)[0];
            alt = alt.substring(1, alt.length - 1);

            // 获取图片资源链接
            let src = img.match(/\(.*?\)$/)[0];
            src = src.substring(1, src.length - 1);

            myNode.push(new Asset({ assetType: "img", alt, src }));
            continue;
        }
        // 无序列表
        if (str.match(/-\s/)) {
            let value = [];

            do {
                let str = inputText[i];
                let { index } = str.match(/-\s/);
                value.push(
                    renderInlineNode(str.substring(index + 2, str.length))
                );
            } while (inputText[++i]?.match(/-\s/));

            i--; // !important
            myNode.push(new List({ listType: false, value }));
            continue;
        }
        // 有序列表
        if (str.match(/\d\.\s/)) {
            let value = [];

            do {
                let str = inputText[i];
                let { 0: match, index } = str.match(/\d\.\s/);
                value.push(
                    renderInlineNode(
                        str.substring(match.length + index, str.length)
                    )
                );
            } while (inputText[++i]?.match(/\d\.\s/));

            i--; // !important
            myNode.push(new List({ listType: true, value }));
            continue;
        }

        // 默认情况，以上所有情况不触发，则触发此情况
        myNode.push(new Parallel({ value: renderInlineNode(str) }));
    }
    return myNode;
};

export { renderBlockNode };
