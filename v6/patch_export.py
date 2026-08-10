#!/usr/bin/env python3
"""
Post-Export-Patch fuer divoVAM-Exporte aus Cinderella.

Cinderella ueberschreibt beim Export alles, was von Hand ergaenzt wurde.
Dieses Skript wendet nach jedem Export die noetigen Anpassungen an:

  1. touch-action / viewport   -> Apple Pencil "Kritzeln" blockiert sonst
                                  die Stifteingabe (Abako vs. Articulate)
  2. ?full                     -> fensterfuellende Darstellung ohne zweite Datei
  3. ?rect=<preset|a,b,c,d>    -> anderer sichtbarer Weltausschnitt

Aufruf:
    python3 patch_export.py divoVAM.html                # patcht in place
    python3 patch_export.py divoVAM.html out.html       # schreibt Kopie

Das Skript ist idempotent: mehrfaches Anwenden aendert nichts.
"""

import re
import sys
import pathlib

# --------------------------------------------------------------------------
# Presets fuer den sichtbaren Weltausschnitt  [links, oben, rechts, unten]
# Neue Formate hier ergaenzen - keine neue HTML-Datei noetig.
# --------------------------------------------------------------------------
RECT_PRESETS = {
    "divomath": [-0.27428199274629916, 18.50596739294148,
                 24.217486536011474, -0.40335587168573406],
    "classic":  [-1.7258704824220432, 22.351088099515103,
                 36.49896464677728, 0.23437747292151204],
}
DEFAULT_PRESET = "divomath"

MARKER = "divoVAM-post-export-patch"


# --------------------------------------------------------------------------
# 1) Kopf: viewport + touch-action
# --------------------------------------------------------------------------
HEAD_PATCH = """
    <!-- {marker}: Stifteingabe (Kritzeln/Scribble) -->
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <style type="text/css">
      html, body {{ overscroll-behavior: none; }}
      #CSCanvas, #CSCanvas canvas {{
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }}
    </style>
"""


# --------------------------------------------------------------------------
# 2)+3) Inline-JS: Layout- und Ausschnittssteuerung per URL
# --------------------------------------------------------------------------
def js_prelude():
    presets = ",\n    ".join(
        '"%s": [%s]' % (k, ", ".join(repr(v) for v in vals))
        for k, vals in RECT_PRESETS.items()
    )
    return """
/* {marker}: Layout und Ausschnitt per URL steuerbar
   ?full            -> Canvas fuellt das Browserfenster
   ?rect=classic    -> benanntes Preset
   ?rect=a,b,c,d    -> freier Ausschnitt [links,oben,rechts,unten]        */
var DIVO_Q = new URLSearchParams(window.location.search);
var DIVO_FULL = DIVO_Q.has("full");
var DIVO_PRESETS = {{
    {presets}
}};
var DIVO_RECT = DIVO_PRESETS["{default}"];
(function () {{
    var r = DIVO_Q.get("rect");
    if (!r) return;
    if (DIVO_PRESETS[r]) {{ DIVO_RECT = DIVO_PRESETS[r]; return; }}
    var v = r.split(",").map(Number);
    if (v.length === 4 && v.every(function (n) {{ return !isNaN(n); }})) DIVO_RECT = v;
}})();
if (DIVO_FULL) {{
    /* Das Inline-Script laeuft im <head>: document.body existiert hier noch
       nicht. Die Groessen setzt daher das CSS ueber die Klasse "divo-full",
       die auf <html> gesetzt wird (documentElement gibt es bereits). */
    document.documentElement.classList.add("divo-full");
    window.addEventListener("resize", function () {{ window.location.reload(); }});
}}
""".format(marker=MARKER, presets=presets, default=DEFAULT_PRESET)


FULL_CSS = """
    <style type="text/css">
      /* {marker}: greift nur mit ?full */
      html.divo-full, html.divo-full body {{ height: 100%; margin: 0; padding: 0; }}
      html.divo-full #CSCanvas {{ width: 100vw; height: 100vh; }}
    </style>
"""


def patch(text: str) -> str:
    if MARKER in text:
        print("  bereits gepatcht - keine Aenderung")
        return text

    # --- 1) Kopf ---------------------------------------------------------
    head = HEAD_PATCH.format(marker=MARKER) + FULL_CSS.format(marker=MARKER)
    if '<meta charset="UTF-8">' not in text:
        raise SystemExit("FEHLER: <meta charset=\"UTF-8\"> nicht gefunden - "
                         "ist das wirklich ein Cinderella-Export?")
    text = text.replace('<meta charset="UTF-8">',
                        '<meta charset="UTF-8">\n' + head, 1)

    # --- 2) Prelude vor den CindyJS-Aufruf -------------------------------
    if "var cdy = CindyJS({" not in text:
        raise SystemExit("FEHLER: CindyJS-Aufruf nicht gefunden.")
    text = text.replace("var cdy = CindyJS({",
                        js_prelude() + "\nvar cdy = CindyJS({", 1)

    # --- 3) ports: Groesse und visibleRect dynamisch ----------------------
    m = re.search(r"ports:\s*\[\{(.*?)\}\]", text, re.S)
    if not m:
        raise SystemExit("FEHLER: ports-Block nicht gefunden.")
    block = m.group(1)

    new_block = re.sub(r"width:\s*[\d.]+",
                       "width: DIVO_FULL ? window.innerWidth : 885", block, count=1)
    new_block = re.sub(r"height:\s*[\d.]+",
                       "height: DIVO_FULL ? window.innerHeight : 519", new_block, count=1)
    new_block = re.sub(r"visibleRect:\s*\[[^\]]*\]",
                       "visibleRect: DIVO_RECT", new_block, count=1)

    if new_block == block:
        raise SystemExit("FEHLER: ports-Block konnte nicht angepasst werden.")
    text = text[:m.start(1)] + new_block + text[m.end(1):]

    return text


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    src = pathlib.Path(sys.argv[1])
    dst = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else src
    if not src.is_file():
        raise SystemExit("Datei nicht gefunden: %s" % src)

    text = src.read_text(encoding="utf-8")
    out = patch(text)
    dst.write_text(out, encoding="utf-8")
    print("gepatcht: %s -> %s" % (src.name, dst.name))
    print("  Presets: %s (Standard: %s)"
          % (", ".join(RECT_PRESETS), DEFAULT_PRESET))


if __name__ == "__main__":
    main()
