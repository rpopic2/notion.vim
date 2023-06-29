# notion.vim
Edit your notion pages in vim.

# Project status
This project is in very early stage of development.

It is currently capable of:

* Fetch your notion pages and clone to local folder. It parses notion json file into markdown file.
* Update a single block
* vim bindings for features listed above.

Upcoming features:

* Update whole page
* Create new block
* Create new page
* Parse markdown file inton notion json file


# Installation
Use your favourite package manager.
```vim
Plug 'rpopic2/notion.vim'
```

Currently, you'll need to manually create a new notion integration and retrieve notion api access key for yourself.

And export enviroment variable as following:

```bash
export NOTION_KEY=<your-key-goes-here>
```

Add connection to integration on your page by pressing ... button -> Connections -> Add connection, and select the integration.

# Usage

`:NotionVimPull`

It pulls all pages with integration connected.

`:NotionVimUpdateLine`

It updates line currently under cursor.
