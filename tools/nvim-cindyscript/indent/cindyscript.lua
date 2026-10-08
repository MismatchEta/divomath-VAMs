-- Indentation by brackets, see lua/cindyscript/indent.lua
if vim.b.did_indent then
  return
end
vim.b.did_indent = true

vim.opt_local.autoindent = true
vim.opt_local.indentexpr = "v:lua.require'cindyscript.indent'.get(v:lnum)"
vim.opt_local.indentkeys = "0),0],0},!^F,o,O"

vim.b.undo_indent = "setlocal autoindent< indentexpr< indentkeys<"
