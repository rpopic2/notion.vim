const {Client} = require('@notionhq/client');
const fs = require('fs');
const notion = new Client({auth: process.env.NOTION_KEY});
const pageId = '4df68447d82540129ea744754e00ff8f';

(async ()=> {
    await read_page();
    console.log("done!");
})();

async function read_page(){
    const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 50
    });
    for (blk of response.results) {
        let block_t = blk.type;
        if (block_t == "heading_1") write("# ");
        for (txt of blk[block_t].rich_text) {
            writeln(txt.plain_text);
        }
    }
    fwrite();
}


let buf = "";
function write(str){
    buf += str;
}
function writeln(str){
    buf += str + "\n";
}
function fwrite() {
    fs.writeFile("test.md", buf,()=>{});
}
