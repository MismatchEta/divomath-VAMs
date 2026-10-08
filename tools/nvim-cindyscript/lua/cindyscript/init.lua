--- CindyScript for Neovim: starts the language server. See ../../README.md.
local M = {}

-- Folder of the plugin, three levels above this file
M.root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h:h:h")

--- A file of the VS Code extension next to this plugin; both share its analysis.
function M.shared(file)
  return vim.fs.normalize(M.root .. "/../vscode-cindyscript/" .. file)
end

local defaults = {
  -- How to start the language server
  cmd = { "node", M.root .. "/server/cindyscript-lsp.js" },
  -- Warnings for common traps; syntax errors are always shown
  lint = true,
  -- Functions that exist without a definition in the scripts (nil: the server's defaults)
  external_functions = nil,
  -- Fold by the server: brackets, block comments, sections
  folding = true,
}

--- Register and enable the language server. Needs Neovim 0.11.
function M.setup(opts)
  opts = vim.tbl_deep_extend("force", defaults, opts or {})

  local settings = { cindyscript = { lint = { enable = opts.lint, externalFunctions = opts.external_functions } } }

  vim.lsp.config("cindyscript", {
    cmd = opts.cmd,
    filetypes = { "cindyscript" },
    root_markers = { ".git" },
    init_options = settings,
    settings = settings,
  })
  vim.lsp.enable("cindyscript")

  -- Read by ftplugin/cindyscript.lua
  vim.g.cindyscript_folding = opts.folding
end

return M
