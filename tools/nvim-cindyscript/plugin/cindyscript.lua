-- Recognise .cindyscript files. Everything else happens per buffer
-- (ftplugin/, indent/, syntax/) and in require("cindyscript").setup().
vim.filetype.add({ extension = { cindyscript = "cindyscript" } })
