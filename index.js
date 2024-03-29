const {Client} = require('@notionhq/client');
const fs = require('fs');
const notion = new Client({auth: process.env.NOTION_KEY});

if (!process.argv[2]) {
    print_help();
    return 1;
}
const flag = process.argv[2];

if (flag === "--pull") {
    (async () => {
        fs.mkdir("workspace", ()=>{});
        await retrieve_pages();
        console.log("done!");
        return 0;
    })();
} else if (flag === "--update") {
    (async () => {
        await update_block(process.argv[3], process.argv[4])
        return 0;
    })();
} else {
    print_help();
    return 1
}

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
        write("[notionvim=");
        write(blk.id);
        console.log(blk.id);
        write("]");
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

async function update_block(block_id, content) {
    const response = await notion.blocks.update({
        "block_id": block_id,
        "paragraph": {
            "rich_text": [{
                "text": {
                    "content": content
                }
            }]
        }
    });
    console.log("update block: %s", response);
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

function print_help() {
    console.log("usage:\n--pull\n--update <block_id> <content>");
}
