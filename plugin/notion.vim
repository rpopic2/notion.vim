" notion.vim
" edit notion in your favourite editor
" Last Change: 28 Jun 2023
" Version: 0.1
" Maintainter: rpopic2 (github.com/rpopic2)

if exists("g:loaded_notionvim")
    finish
endif
let g:loaded_notionvim = 1

let s:notionvim_is_syncing = 0

" au
augroup notionvimau
    autocmd!
    " au BufWrite *.md call s:NotionvimPull()
    " au InsertLeave *.md call s:NotionvimUpdate()
augroup end


" commands
if !exists(":NotionVimPull")
    command NotionVimPull :call s:NotionvimPull()
endif
if !exists(":NotionVimPushLine")
    command NotionVimPushLine :call s:NotionvimUpdate()
endif

function s:NotionvimPull()
    echon "pulling..."
    silent !node . --pull
    echon "pull"
endfunction

function s:NotionvimUpdate()
    let curline = getline(".")
    let block_id = curline[11:46]
    let content = curline[48:]
    execute "!node . --update " . block_id . " \"" . content . "\""
    echo "update"
endfunction

" conceal
match Conceal /^\[notionvim=.*]/
set conceallevel=3
set concealcursor=ni
