-- Highlighting for CindyScript: the rules of the VS Code grammar
-- (../vscode-cindyscript/syntaxes/cindyscript.tmLanguage.json) in Vim's
-- regex dialect. The built-in functions come from the shared builtins.json.
if vim.b.current_syntax then
  return
end

--- Run ":syntax <args>".
local function syn(args)
  vim.cmd("syntax " .. args)
end

--- A pattern between slashes; slashes inside get escaped.
local function pat(s)
  return "/" .. s:gsub("/", [[\/]]) .. "/"
end

-- Characters of names: letters (also accented and Greek ones), digits, '
local START = [[A-Za-z'À-ɏͰ-Ͽ]]
local CHAR = [[A-Za-z0-9'À-ɏͰ-Ͽ]]

-- Not in the middle of a name
local BOUND = "[" .. CHAR .. [[]\@<!]]

-- A name, which may contain blanks: "draw label"
local NAME = "[" .. START .. "][" .. CHAR .. [[]*\%([ \t]\+[]] .. CHAR .. [[]\+\)*]]

-- Built-ins that steer the program flow
local CONTROL = { "if", "while", "repeat", "forall", "apply", "select", "regional", "local", "release" }

syn("case match")
syn("iskeyword @,48-57,39")   -- letters, digits, ' ("_" is the index operator)
syn("sync fromstart")

-- --- operators, numbers, constants, variables by convention ---
syn("match cindyscriptOperator " .. pat([=[:=_\|::=\|:=\|->\|\%u2192\|\~!=\|\~<=\|\~>=\|==\|!=\|<>\|<=\|>=\|\~=\|\~<\|\~>\|++\|--\|\~\~\|<:\|:>\|\.\.\|[-+*/^%&!=<>:._|]]=]))
syn("match cindyscriptNumber " .. pat(BOUND .. [[\%(\d\+\%(\.\.\@!\d*\)\=\|\.\d\+\)\%([eE][+-]\=\d\+\)\=]]))
syn("match cindyscriptConstant " .. pat(BOUND .. [[\u[A-Z0-9]\+\%('[A-Z0-9]\+\)*[]] .. CHAR .. [[]\@!]]))
syn("match cindyscriptConfig " .. pat(BOUND .. "'[A-Za-z][" .. CHAR .. "]*"))
syn("match cindyscriptModVar " .. pat(BOUND .. "mod'[A-Za-z][" .. CHAR .. "]*"))
syn("match cindyscriptIterator " .. pat(BOUND .. [[#[1-9]\=]]))
syn("keyword cindyscriptBoolean true false")
syn("keyword cindyscriptMathConst pi")

-- --- modifiers: color->red ---
syn("match cindyscriptModifier " .. pat(BOUND .. [[\%(mod'\)\=[A-Za-z][]] .. CHAR .. [[]*\ze\s*\%(->\|\%u2192\)]]))

-- --- calls; later rules win when several start at the same place ---
syn("match cindyscriptCall " .. pat(BOUND .. NAME .. [[\ze\s*(]]))

local ok, data = pcall(function()
  local file = require("cindyscript").shared("lib/builtins.json")
  return vim.json.decode(table.concat(vim.fn.readfile(file), "\n"))
end)
if ok and data and data.functions then
  local names = {}
  for name in pairs(data.functions) do
    if not vim.tbl_contains(CONTROL, name) then
      table.insert(names, name)
    end
  end
  -- Longest first, so no name stops at a shorter one it starts with.
  -- Lower case only: ignoring case (\c) made this pattern over 20 times slower,
  -- and the scripts write built-ins in lower case anyway.
  table.sort(names, function(a, b)
    return #a > #b or (#a == #b and a < b)
  end)
  syn("match cindyscriptBuiltin " .. pat(BOUND .. [[\%(]] .. table.concat(names, [[\|]]) .. [[\)\ze\s*(]]))
end

syn("match cindyscriptControl " .. pat(BOUND .. [[\%(]] .. table.concat(CONTROL, [[\|]]) .. [[\)\ze\s*(]]))

-- --- definitions: name(params) := ... ---
syn("match cindyscriptDefinition " .. pat(BOUND .. NAME .. [[\ze\s*([^()]*)\s*::\==\%(_\)\@!]])
    .. " nextgroup=cindyscriptParams skipwhite")
syn("region cindyscriptParams contained matchgroup=cindyscriptParen start=" .. pat("(") .. " end=" .. pat(")")
    .. " contains=cindyscriptParam")
syn("match cindyscriptParam contained " .. pat("[" .. START .. "#][" .. CHAR .. "]*"))

-- --- strings: no backslash escapes, "" is a quote ---
syn("region cindyscriptString start=" .. pat('"') .. " skip=" .. pat('""') .. " end=" .. pat('"'))

-- --- comments, block comments may be nested ---
-- matchgroup keeps the opening "/*" of a comment from also starting a nested one
syn("keyword cindyscriptTodo contained TODO FIXME XXX NOTE")
syn("match cindyscriptDocTag contained " .. pat([[@\a\+]]))
syn("region cindyscriptNestedComment contained matchgroup=cindyscriptNestedComment start=" .. pat([[/\*]])
    .. " end=" .. pat([[\*/]]) .. " contains=cindyscriptNestedComment")
syn("region cindyscriptBlockComment matchgroup=cindyscriptBlockComment start=" .. pat([[/\*]])
    .. " end=" .. pat([[\*/]]) .. " contains=cindyscriptNestedComment,cindyscriptTodo")
syn("region cindyscriptDocComment matchgroup=cindyscriptDocComment start=" .. pat([[/\*\*/\@!]])
    .. " end=" .. pat([[\*/]]) .. " contains=cindyscriptNestedComment,cindyscriptDocTag,cindyscriptTodo")
syn("match cindyscriptLineComment " .. pat([[//.*$]]) .. " contains=cindyscriptTodo")
-- Section headings of the framework: "// C.1 | Atom"
syn("match cindyscriptHeading " .. pat([[^\s*//\s*\u\%(\.\d\+\a\=\)\=\s*|.*$]]))

-- --- colours, by the standard groups every colour scheme knows ---
local links = {
  cindyscriptLineComment = "Comment",
  cindyscriptBlockComment = "Comment",
  cindyscriptNestedComment = "Comment",
  cindyscriptDocComment = "SpecialComment",
  cindyscriptDocTag = "Special",
  cindyscriptHeading = "Title",
  cindyscriptTodo = "Todo",
  cindyscriptString = "String",
  cindyscriptNumber = "Number",
  cindyscriptBoolean = "Boolean",
  cindyscriptMathConst = "Constant",
  cindyscriptConstant = "Constant",
  cindyscriptConfig = "Identifier",
  cindyscriptModVar = "Identifier",
  cindyscriptIterator = "Special",
  cindyscriptModifier = "Label",
  cindyscriptCall = "Function",
  cindyscriptDefinition = "Function",
  cindyscriptParam = "Identifier",
  cindyscriptBuiltin = "Special",
  cindyscriptControl = "Keyword",
  cindyscriptOperator = "Operator",
}
for group, target in pairs(links) do
  vim.api.nvim_set_hl(0, group, { link = target, default = true })
end

vim.b.current_syntax = "cindyscript"
