const {Client} = require('@notionhq/client');
const fs = require('fs');
const notion = new Client({auth: process.env.NOTION_KEY});

(async () => {
    fs.mkdir("workspace", ()=>{});
    await retrieve_pages();
    console.log("done!");
})();

async function retrieve_pages(query) {
    const response = await notion.search(query);
    for (page of response.results) {
        if (page.object != "page") continue;
        const icon = page.icon;
        if (icon !== null) write(icon[icon.type] + ' ');
        let page_name = page.properties.title.title[0].text.content;
        console.log("Found page : %s", page_name);
        writeln(page_name);
        await retrieve_page(page_name, page.id);
        fwrite(page_name + ".md", buf);
    }
}

async function retrieve_page(page_name, page_id) {
    console.log("Retrieve page content of : %s", page_name);
    const response = await notion.blocks.children.list({
        block_id: page_id,
        page_size: 50
    });
    fwrite(page_name + ".json", JSON.stringify(response));
    for (blk of response.results) {
        const block_t = blk.type;
        console.log("\tFound block type of %s: ", block_t);
        if (blk[block_t].rich_text === undefined) continue;
        let block = blk[block_t];
        for (rtxt of block.rich_text) {
            write(parse_md_type(block_t, block));
            let ptxt = rtxt?.plain_text;
            if (ptxt === undefined) ptxt = "";
            let surround = parse_md_anno(rtxt.annotations)
            write(surround + ptxt + surround);
            console.log("\t\t%s:", ptxt);
        }
        endl();
    }
}
function parse_md_type(block_t, block) {
    switch (block_t) {
        case "heading_1":
            return "# ";
        case "heading_2":
            return "## ";
        case "heading_3":
            return "### ";
        case "to_do":
            if (block.checked) return "[X] ";
            return "[ ] ";
        default:
            return "";
    }
}
function parse_md_anno(annotations)
{
    let _buf = "";
    if(annotations.bold) _buf += "**";
    if(annotations.italic) _buf += "*";
    if(annotations.strikethrough) _buf += "~~";
    if(annotations.underline) _buf += "_";
    if(annotations.code) _buf += "`";
    return _buf;
}


let buf = "";
function write(str) {
    buf += str;
}
function writeln(str) {
    buf += str + "\n";
}
function endl(){
    buf += "\n";
}
function flush() {
    buf = "";
}
function fwrite(fd, _buf) {
    fs.writeFile("workspace/" + fd, _buf, ()=>{});
    flush();
}
