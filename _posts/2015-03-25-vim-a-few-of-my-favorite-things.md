---
layout: post
title: "Vim: These Are A Few of My Favorite Things"
dek: "Some favorite customizations from my .vimrc explained."
---

Over the years as a designer and front-end developer I've tried many text editors, but eventually I always wind up coming back to Vim. Though it's decades old, I've come to love the power of word motions, modal editing, and extreme customization.

Here are some of my customizations to Vim that make it an editor I can't live without:

### Persistent Undo

```vim
if exists("&undodir")
    set undofile          "Persistent undo! Pure money.
    let &undodir=&directory
    set undolevels=500
    set undoreload=500
endif
```

This is an amazing feature. When turned on, Vim will remember everything that it's done from in that document, even after you close it! 

There's a couple things that are happening in the line above. First, it checks to see if this feature is available in your version of Vim, and if it is, it turns it on. It then sets the storage of the undo trees to match your temporary folder. It then tells it to keep track of the last 500 actions for that document.

### Pinky Savers

```vim
"Changes leader from \ to ,
let mapleader = ","

"Map : to ; then ; to , in normal mode, massive pinky-saver
nore ; :
nore , ;

"Map escape key to jj -- much faster
imap jj <esc>
```

The default configuration of Vim causes your pinky fingers to stretch all over this place.

Changing the leader from `\` to `,` makes performing leader commands much, MUCH easier.

Similarly, instead of having to reach for that left shift key to get your `:` commands, you can just swap their functions (very rarely do I use the normal function for the semi-colon). 

And lastly, when you're inside insert mode, instead of reaching over for the `esc` key, a quick double-tap of the `j` key will send you back to normal mode.

Save those pinky fingers for tea time!

### Window Navigation

```vim
"Easier window navigation, control+letter moves in that direction
nmap <C-h> <C-w>h
nmap <C-j> <C-w>j
nmap <C-k> <C-w>k
nmap <C-l> <C-w>l

"Firefox-style tab selection with command+number, mac only
map <D-1> 1gt
map <D-2> 2gt
map <D-3> 3gt
map <D-4> 4gt
map <D-5> 5gt
map <D-6> 6gt
map <D-7> 7gt
map <D-8> 8gt
map <D-9> 9gt
map <D-0> :tablast<CR>
imap <D-1> <esc>1gt
imap <D-2> <esc>2gt
imap <D-3> <esc>3gt
imap <D-4> <esc>4gt
imap <D-5> <esc>5gt
imap <D-6> <esc>6gt
imap <D-7> <esc>7gt
imap <D-8> <esc>8gt
imap <D-9> <esc>9gt
imap <D-0> <esc>:tablast<CR>
```

I have always loved the flexibility of Vim's windows. Slice, dice, and make julienne fries of those windows into splits, tabs, or whatever! But getting around in them isn't always the easiest.

Tapping into the vim's directional keys (`hjkl`) and adding the control key will move you across splits just a little faster.

I tend to use a lot of tabs as well, especially if I'm jumping across different sections of code. I've mapped `command` + `number` to move me to each tab, just like Firefox or Chrome.

### Bubbling Lines

```vim
" Bubble single lines
nmap <C-Up> ddkP
nmap <C-Down> ddp
" Bubble multiple lines
vmap <C-Up> xkP`[V`]
vmap <C-Down> xp`[V`]
```

Originally from Drew Neil's [Vimcast](http://vimcasts.org/episodes/bubbling-text/), this set of mappings will take your current line or selection and move it up or down one line at a time, shifting the other lines around it.

If you happen to have the super handy [Unimpaired](https://github.com/tpope/vim-unimpaired) plugin by Tim Pope you can replace the vanilla actions with the plugin commands:

```vim
" Bubble single lines - uses unimpaired plugin actions
nmap <C-Up> [e
nmap <C-Down> ]e
" Bubble multiple lines
vmap <C-Up> [egv
vmap <C-Down> ]egv
```

### Duplicating Lines

```vim
"Duplicate lines above and below
imap <C-A-down> <esc>Ypk
nmap <C-A-down> Ypk
vmap <C-A-down> y`>pgv
imap <C-A-up> <esc>YPj
nmap <C-A-up> YPj
vmap <C-A-up> y`<Pgv
```

This is extremely handy for prototyping or filling out some markup quickly.

These mappings will duplicate your current line or selection either above or below. You can quickly spam this to create a bunch of identical blocks.

### Quick File Navigation

```vim
"Will open files in current directory, allows you to leave the working cd in
"the project root. You can also use %% anywhere in the command line to expand.
cnoremap %% <C-R>=expand('%:h').'/'<cr>
map <leader>ew :e %%
map <leader>es :sp %%
map <leader>ev :vsp %%
map <leader>et :tabe %%
```

While I usually use a combination of the [Ctrl-P](https://github.com/kien/ctrlp.vim) plugin and [Ag](http://geoff.greer.fm/ag/) (more on this later), sometimes there's no substitute for quick and dirty local based file edits.

These mappings will shortcut `%%` to expand the local directory of the file you're working in on the command line. From that you can open any file relative to your currently open file. Full window edit, split, vertical split, or tab, pick your poison.

### Previous Buffer Toggle

```vim
"Jump back to last edited buffer
nmap <D-b> :e#<CR>
imap <D-b> <esc>:e#<CR>
```

This one is crazy handy. Ever find yourself jumping between two files? Or you just need to open one to copy something real quick, then put it back in that first file?

This mapping will flip you back between the last edited buffer and your current one, making them switch places. Hitting it again will again cause the buffers to flip returning you to the original state.

Boom. Done.

It's relative to the last two files you had open.

#### Remember Cursor Positions

```vim
"Jump to last cursor position when opening a file
autocmd BufReadPost * call SetCursorPosition()
function! SetCursorPosition()
    if &filetype !~ 'svn\|commit\c'
        if line("'\"") > 0 && line("'\"") <= line("$")
            exe "normal! g`\""
            normal! zz
        endif
    end
endfunction
```

This autocommand and helper function fire off whenever you open a buffer that doesn't match the provided filetype regex. If the function finds that if the line number of the last known position is greater than 0 but less than or equal to the last line, it will jump to that position and center the window.

#### Final Words

These are just a few of my favorite things in Vim, there's many more. I keep my dotfiles [in a repo on Github](https://github.com/nathanlong/dotfiles), if you'd like to [see the rest of my customizations](https://github.com/nathanlong/dotfiles/blob/master/vim/vimrc). Pilfer away!

If you find something particularly useful or have questions about something, feel free to tweet at me!

