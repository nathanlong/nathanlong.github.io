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

There's a couple things that are happening in the line above. First, it checks to see if this feature is available in your version of Vim, and if it is, it turns it on with `set undofile`. It then sets the storage of the undo trees to where your swap files are stored (I like to keep everything in the same place). It then tells it to keep track of the last 500 actions for that document.

### Pinky Savers

```vim
"Changes leader from \ to ,
let mapleader = ","

"Map : to ; (then remap ;) -- massive pinky-saver
noremap ; :
noremap <M-;> ;

"Map escape key to jj -- much faster
inoremap jj <esc>
```

The default configuration of Vim causes your pinky fingers to stretch all over this place.

Changing the leader from `\` to `,` makes performing leader commands much, MUCH easier.

Similarly, instead of having to reach for that left shift key to get your `:` commands, we can move the `;` out of the way by remapping it to `<M-;>`. This allows you to access `:` with just one pinky instead of two.

And lastly, when you're inside insert mode, instead of reaching over for the `esc` key, a quick double-tap of the `j` key will send you back to normal mode.

Save those pinky fingers for tea time!

### Window Navigation

```vim
"Easier window navigation, control+letter moves in that direction
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

"Firefox-style tab selection with command+number, mac only
nnoremap <D-1> 1gt
nnoremap <D-2> 2gt
nnoremap <D-3> 3gt
nnoremap <D-4> 4gt
nnoremap <D-5> 5gt
nnoremap <D-6> 6gt
nnoremap <D-7> 7gt
nnoremap <D-8> 8gt
nnoremap <D-9> 9gt
nnoremap <D-0> :tablast<CR>
inoremap <D-1> <esc>1gt
inoremap <D-2> <esc>2gt
inoremap <D-3> <esc>3gt
inoremap <D-4> <esc>4gt
inoremap <D-5> <esc>5gt
inoremap <D-6> <esc>6gt
inoremap <D-7> <esc>7gt
inoremap <D-8> <esc>8gt
inoremap <D-9> <esc>9gt
inoremap <D-0> <esc>:tablast<CR>
```

I have always loved the flexibility of Vim's windows. Slice, dice, and make julienne fries of those windows into splits, tabs, or whatever! But getting around in them isn't always the easiest.

Tapping into the vim's directional keys (`hjkl`) and adding the control key will move you across splits just a little faster.

I tend to use a lot of tabs as well, especially if I'm jumping across different sections of code. I've mapped `command` + `number` to move me to each tab, just like Firefox or Chrome. The `<D>` operator is specific to Macs running Vim in a GUI, you can easy swap `<D>` for `<C>` (control) or `<M>` (meta/alt).

### Bubbling Lines

```vim
" Bubble single lines
nnoremap <C-Up> ddkP
nnoremap <C-Down> ddp
" Bubble multiple lines
xnoremap <C-Up> xkP`[V`]
xnoremap <C-Down> xp`[V`]
```

Originally from Drew Neil's [Vimcast](http://vimcasts.org/episodes/bubbling-text/), this set of mappings will take your current line or selection and move it up or down one line at a time, shifting the other lines around it.

If you happen to have the super handy [Unimpaired](https://github.com/tpope/vim-unimpaired) plugin by Tim Pope you can replace the vanilla actions with the plugin commands:

```vim
" Bubble single lines - uses unimpaired plugin actions
nnoremap <C-Up> [e
nnoremap <C-Down> ]e
" Bubble multiple lines
xnoremap <C-Up> [egv
xnoremap <C-Down> ]egv
```

---

**Update:** Reddit user [-romainl-](http://www.reddit.com/user/-romainl-) submitted a reworked version that does not pollute your unnamed register and maintains indentation. Thanks!

```vim
" Bubble lines 
nnoremap <silent> <C-Up>   :move-2<CR>==
nnoremap <silent> <C-Down> :move+<CR>==
xnoremap <silent> <C-Up>   :move-2<CR>gv=gv
xnoremap <silent> <C-Down> :move'>+<CR>gv=gv
```

---

### Duplicating Lines

```vim
"Duplicate lines above and below
inoremap <C-A-down> <esc>Ypk
nnoremap <C-A-down> Ypk
xnoremap <C-A-down> y`>pgv
inoremap <C-A-up> <esc>YPj
nnoremap <C-A-up> YPj
xnoremap <C-A-up> y`<Pgv
```

This is extremely handy for prototyping or filling out some markup quickly.

These mappings will duplicate your current line or selection either above or below. You can quickly spam this to create a bunch of identical blocks.

### Quick File Navigation

```vim
"Will open files in current directory, allows you to leave the working cd in
"the project root. You can also use %% anywhere in the command line to expand.
cnoremap %% <C-R>=expand('%:h').'/'<cr>
nmap <leader>ew :e %%
nmap <leader>es :sp %%
nmap <leader>ev :vsp %%
nmap <leader>et :tabe %%
```

While I usually use a combination of the [Ctrl-P](https://github.com/kien/ctrlp.vim) plugin and [Ag](http://geoff.greer.fm/ag/) (more on this later), sometimes there's no substitute for quick and dirty local based file edits.

These mappings will shortcut `%%` to expand the local directory of the file you're working in on the command line. From that you can open any file relative to your currently open file. Full window edit, split, vertical split, or tab, pick your poison.

### Previous Buffer Toggle

```vim
"Jump back to last edited buffer
nnoremap <D-b> :e#<CR>
inoremap <D-b> <esc>:e#<CR>
```

This one is crazy handy. Ever find yourself jumping between two files? Or you just need to open one to copy something real quick, then put it back in that first file?

This mapping will flip you back between the last edited buffer and your current one, making them switch places. Hitting it again will again cause the buffers to flip returning you to the original state.

Boom. Done.

It's relative to the last two files you had open. Again, the `<D>` mapping is specific to Macs, you can also use `<C>` or `<M>`.

---

**Update:** When I published this I wasn't aware of the `<C-^>` command that does the same thing. The benefit though over the original mapping is that it will also work with unnamed files:

```vim
"Jump back to last edited buffer
nnoremap <D-b> <C-^>
inoremap <D-b> <esc><C-^>
```

---

#### Remember Cursor Positions

```vim
"Jump to last cursor position when opening a file
autocmd BufReadPost * call s:SetCursorPosition()
function! s:SetCursorPosition()
    if &filetype !~ 'svn\|commit\c'
        if line("'\"") > 0 && line("'\"") <= line("$")
            exe "normal! g`\""
            normal! zz
        endif
    end
endfunction
```

This autocommand and helper function fire off whenever you open a buffer that doesn't match the provided filetype regex. If the function finds that if the line number of the last known position is greater than 0 but less than or equal to the last line, it will jump to that position and center the window.

---

**Update:** Thanks to reddit user [\_\_\_violet\_\_\_](http://www.reddit.com/user/___violet___) for suggesting the function be set as a script-local instead of a global function, and helping me use the correct mapping modes.

---

#### Final Words

These are just a few of my favorite things in Vim, there's many more. I keep my dotfiles [in a repo on Github](https://github.com/nathanlong/dotfiles), if you'd like to [see the rest of my customizations](https://github.com/nathanlong/dotfiles/blob/master/vim/vimrc). Pilfer away!

If you find something particularly useful or have questions about something, feel free to tweet at me! Or you can [join the discussion on Reddit](http://www.reddit.com/r/vim/comments/30abt6/these_are_a_few_of_my_favorite_vim_things/).

