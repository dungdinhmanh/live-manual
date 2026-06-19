#!/bin/sh
# Full upstream chain: SiSU source -> HTML -> Markdown -> drift check.
#
# Reproduces the upstream `live-manual` build (manual/Makefile `build:` target),
# then feeds the generated HTML through this repo's converter and the verify
# gate. Intended for CI on Debian/Ubuntu where `sisu` is the packaged Debian
# version — the same toolchain that produces the canonical manual — so the HTML
# this consumes is byte-identical to what ships upstream.
#
# Usage:
#   scripts/build-from-sisu.sh [LIVE_MANUAL_SRC]
#
#   LIVE_MANUAL_SRC  Path to a live-manual source checkout (the dir holding
#                    `manual/en/live-manual.ssm`). Defaults to the sibling
#                    clone next to this repo, then $LIVE_MANUAL_SRC env.
#
# Exit codes:
#   0  HTML rebuilt, converted, output matches committed golden.
#   1  converter output drifted from golden (intended change -> review+commit;
#      otherwise a regression). See `bun run verify` output.
#   2  prerequisite missing (sisu not installed, or source path not found).
#
# A non-zero exit from the SiSU build itself also propagates (set -e).

set -eu

# --- resolve paths ---------------------------------------------------------
# Repo root = parent of this script's dir, resolved without relying on GNU-only
# `readlink -f` (keeps the script portable across CI runners).
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

SRC=${1:-${LIVE_MANUAL_SRC:-"$REPO_ROOT/../live-manual"}}

# --- preflight -------------------------------------------------------------
if ! command -v sisu-html >/dev/null 2>&1; then
  echo "E: sisu-html not found in PATH." >&2
  echo "I: Install the Debian SiSU toolchain:  apt-get install -y sisu" >&2
  exit 2
fi

if ! command -v bun >/dev/null 2>&1; then
  echo "E: bun not found in PATH." >&2
  echo "I: Install bun:  https://bun.sh" >&2
  exit 2
fi

MASTER="$SRC/manual/en/live-manual.ssm"
if [ ! -f "$MASTER" ]; then
  echo "E: live-manual master not found: $MASTER" >&2
  echo "I: Pass the source checkout path, or clone it:" >&2
  echo "I:   git clone https://salsa.debian.org/live-team/live-manual.git \"$SRC\"" >&2
  exit 2
fi

echo "I: live-manual source : $SRC"
echo "I: web repo           : $REPO_ROOT"

# --- 1. SiSU: source -> HTML ----------------------------------------------
# Mirrors manual/Makefile: configure once, then sisu-html. `--no-search-form`
# drops the CGI search box (we strip it anyway); `--no-manifest` skips the
# per-doc manifest page. Run from `manual/` so sisurc's relative `../build`
# output path resolves the same way the upstream build does.
echo "I: building HTML with sisu-html ..."
( cd "$SRC/manual" \
  && sisu --configure en/live-manual.ssm \
  && sisu-html --no-search-form --no-manifest en/live-manual.ssm )

# sisurc.yml: webserv.path=../build, output_dir_structure_by=filetype
HTML_DIR="$SRC/build/manual/html/live-manual"
if [ ! -d "$HTML_DIR" ] || [ -z "$(ls "$HTML_DIR"/*.en.html 2>/dev/null)" ]; then
  echo "E: expected HTML output not found at: $HTML_DIR" >&2
  echo "I: check sisu's actual output dir (sisurc webserv.path) and adjust." >&2
  exit 2
fi
echo "I: HTML written to    : $HTML_DIR ($(ls "$HTML_DIR"/*.en.html | wc -l) files)"

# --- 2. converter: HTML -> Markdown ---------------------------------------
echo "I: converting HTML -> Markdown ..."
( cd "$REPO_ROOT" && SOURCE_DIR="$HTML_DIR" bun run convert )

# --- 3. drift gate ---------------------------------------------------------
# verify re-runs convert (same SOURCE_DIR) and fails on any diff vs the
# committed golden. Pass SOURCE_DIR through so it checks against THIS build.
echo "I: verifying output against committed golden ..."
( cd "$REPO_ROOT" && SOURCE_DIR="$HTML_DIR" bun run verify )

echo "I: done. SiSU -> HTML -> Markdown chain is consistent with golden."
