// 行内块标签对象
function InlineStyle({
    italic = false,
    bold = false,
    code = false,
    value = undefined,
}) {
    return {
        italic,
        bold,
        code,
        value,
    };
}

// 块级标签对象
// 标题
function Title({ type = "title", titleType = "dafault", value }) {
    return {
        type,
        titleType,
        value,
    };
}
// 代码块
function Code({ type = "code", codeType = "undefine", value }) {
    return {
        type,
        codeType,
        value,
    };
}
// 资源
function Asset({
    type = "asset",
    assetType,
    alt = "图片描述",
    src = "wrong src",
}) {
    return {
        type,
        assetType,
        alt,
        src,
    };
}
// 列表
function List({ type = "list", listType = false, value }) {
    return {
        type,
        listType,
        value,
    };
}
// 段落
function Parallel({ type = "parallel", value }) {
    return {
        type,
        value,
    };
}

export { InlineStyle, Title, Code, Asset, List, Parallel };
