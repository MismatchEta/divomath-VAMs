--- Indentation by brackets: one level deeper after a line that leaves a
--- bracket open, one level less after a line that closes more than it
--- opens, and one level less for a line that starts with a closing bracket.
local M = {}

--- Net number of brackets a line opens. Closing brackets at its start do not
--- count (its own indentation already accounts for them), neither do
--- brackets in strings or after //.
local function opened(line)
  local net = 0
  local i = #line:match("^%s*[%)%]%}]*") + 1

  while i <= #line do
    local c = line:sub(i, i)

    if c == '"' then
      -- Skip the string; "" inside it is a quote
      local j = line:find('"', i + 1, true)
      while j and line:sub(j + 1, j + 1) == '"' do
        j = line:find('"', j + 2, true)
      end
      if not j then
        break
      end
      i = j
    elseif c == "/" and line:sub(i + 1, i + 1) == "/" then
      break
    elseif c == "(" or c == "[" or c == "{" then
      net = net + 1
    elseif c == ")" or c == "]" or c == "}" then
      net = net - 1
    end

    i = i + 1
  end

  return net
end

--- Indent of line lnum, for 'indentexpr'.
function M.get(lnum)
  local prev = vim.fn.prevnonblank(lnum - 1)
  if prev == 0 then
    return 0
  end

  local sw = vim.fn.shiftwidth()
  local indent = vim.fn.indent(prev)
  local net = opened(vim.fn.getline(prev))

  if net > 0 then
    indent = indent + sw
  elseif net < 0 then
    indent = indent - sw
  end

  if vim.fn.getline(lnum):match("^%s*[%)%]%}]") then
    indent = indent - sw
  end

  return math.max(indent, 0)
end

return M
