-- Buffer settings for CindyScript, matching the existing scripts:
-- tabs of width 2, // comments, /** ... */ doc comments with "* " lines.
if vim.b.did_ftplugin then
  return
end
vim.b.did_ftplugin = true

local o = vim.opt_local

o.expandtab = false
o.tabstop = 2
o.shiftwidth = 2
o.softtabstop = 0

o.commentstring = "// %s"
o.comments = "s1:/**,mb:*,ex:*/,s1:/*,mb:*,ex:*/,://"
o.formatoptions:append("ro")   -- continue comments on Enter and o

-- Folding from the language server (brackets, block comments, sections), all open at first
if vim.g.cindyscript_folding ~= false then
  o.foldmethod = "expr"
  o.foldexpr = "v:lua.vim.lsp.foldexpr()"
  o.foldlevel = 99
end

vim.b.undo_ftplugin = "setlocal expandtab< tabstop< shiftwidth< softtabstop< commentstring< comments<"
  .. " formatoptions< foldmethod< foldexpr< foldlevel<"
