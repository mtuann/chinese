#!/usr/bin/env python3
"""Build datasets for the HSK study app.

Outputs:
- data/radicals.json
- data/words.json
- data/grammar.json
- data/meta.json
"""

from __future__ import annotations

import datetime as dt
import io
import json
import re
import unicodedata
import zipfile
from collections import defaultdict
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import requests
from pypinyin import Style, pinyin as pypinyin

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

UNICODE_CJK_RADICALS_URL = "https://www.unicode.org/Public/UCD/latest/ucd/CJKRadicals.txt"
UNICODE_UNIHAN_ZIP_URL = "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip"

COMPLETE_HSK_LOCAL = ROOT / ".tmp_complete_hsk" / "complete.json"
COMPLETE_HSK_URL = "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.json"

GRAMMAR_LOCAL_DIR = ROOT / ".tmp_hsk30" / "New HSK (2021)" / "HSK Grammar"
GRAMMAR_FILES = {
    "1": "HSK 1.txt",
    "2": "HSK 2.txt",
    "3": "HSK 3.txt",
    "4": "HSK 4.txt",
    "5": "HSK 5.txt",
    "6": "HSK 6.txt",
    "7": "HSK 7-9.txt",
}
GRAMMAR_REMOTE_BASE = (
    "https://raw.githubusercontent.com/krmanik/HSK-3.0/main/"
    "New%20HSK%20(2021)/HSK%20Grammar"
)
HAN_BLOCK_RE = re.compile(r"[\u3400-\u9fff]+")


def fetch_text(url: str) -> str:
    resp = requests.get(url, timeout=90)
    resp.raise_for_status()
    return resp.text


def fetch_json(url: str):
    resp = requests.get(url, timeout=90)
    resp.raise_for_status()
    return resp.json()


def radical_sort_key(radical_id: str) -> Tuple[int, int]:
    m = re.match(r"(\d+)(\'*)", radical_id)
    if not m:
        return (999, 0)
    return (int(m.group(1)), len(m.group(2)))


TONE_MARKS = {
    "a": "āáǎàa",
    "e": "ēéěèe",
    "i": "īíǐìi",
    "o": "ōóǒòo",
    "u": "ūúǔùu",
    "ü": "ǖǘǚǜü",
}


def numeric_syllable_to_tone(syllable: str) -> str:
    m = re.match(r"^([a-zA-ZüÜvV:]+)([1-5])$", syllable)
    if not m:
        return syllable

    base = m.group(1).lower().replace("u:", "ü").replace("v", "ü")
    tone = int(m.group(2))
    if tone == 5:
        return base

    vowel_idx = -1
    if "a" in base:
        vowel_idx = base.index("a")
    elif "e" in base:
        vowel_idx = base.index("e")
    elif "ou" in base:
        vowel_idx = base.index("o")
    else:
        for i in range(len(base) - 1, -1, -1):
            if base[i] in "aeiouü":
                vowel_idx = i
                break

    if vowel_idx == -1:
        return base

    vowel = base[vowel_idx]
    marked = TONE_MARKS[vowel][tone - 1]
    return base[:vowel_idx] + marked + base[vowel_idx + 1 :]


def numeric_pinyin_to_tone(pinyin_value: str) -> str:
    parts = re.split(r"(\s+)", pinyin_value.strip())
    out = []
    for part in parts:
        if not part or part.isspace():
            out.append(part)
            continue
        syllables = re.split(r"([-'])", part)
        converted = []
        for s in syllables:
            if s in {"-", "'"}:
                converted.append(s)
            else:
                converted.append(numeric_syllable_to_tone(s))
        out.append("".join(converted))
    return "".join(out)


def load_cjk_radicals() -> List[Dict[str, str]]:
    text = fetch_text(UNICODE_CJK_RADICALS_URL)
    rows: List[Dict[str, str]] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        rid, radical_cp, ideograph_cp = [p.strip() for p in line.split(";")]
        radical_char = chr(int(radical_cp, 16)) if radical_cp else ""
        ideograph = chr(int(ideograph_cp, 16))
        symbol = radical_char or ideograph
        unicode_name = unicodedata.name(symbol, "")
        rows.append(
            {
                "id": rid,
                "symbol": symbol,
                "radical_char": radical_char,
                "ideograph": ideograph,
                "unicode_name": unicode_name,
            }
        )

    rows.sort(key=lambda item: radical_sort_key(item["id"]))
    return rows


def load_unihan_props() -> Tuple[Dict[str, str], Dict[str, str], Dict[str, str], Dict[str, int]]:
    resp = requests.get(UNICODE_UNIHAN_ZIP_URL, timeout=120)
    resp.raise_for_status()

    zf = zipfile.ZipFile(io.BytesIO(resp.content))
    mandarin: Dict[str, str] = {}
    definition: Dict[str, str] = {}
    rsunicode: Dict[str, str] = {}
    strokes: Dict[str, int] = {}

    def parse_file(filename: str) -> Iterable[Tuple[str, str, str]]:
        with zf.open(filename) as f:
            for raw in f:
                line = raw.decode("utf-8").strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split("\t", 2)
                if len(parts) != 3:
                    continue
                cp, prop, val = parts
                char = chr(int(cp[2:], 16))
                yield char, prop, val

    for ch, prop, val in parse_file("Unihan_Readings.txt"):
        if prop == "kMandarin" and ch not in mandarin:
            first = val.split()[0]
            mandarin[ch] = numeric_pinyin_to_tone(first)
        elif prop == "kDefinition" and ch not in definition:
            definition[ch] = val.split(";")[0].strip()

    for ch, prop, val in parse_file("Unihan_IRGSources.txt"):
        if prop == "kRSUnicode" and ch not in rsunicode:
            token = val.split()[0]
            rsunicode[ch] = token.split(".")[0]
        elif prop == "kTotalStrokes" and ch not in strokes:
            raw_val = val.split()[0]
            if raw_val.isdigit():
                strokes[ch] = int(raw_val)

    return mandarin, definition, rsunicode, strokes


def load_complete_hsk_entries() -> List[Dict]:
    if COMPLETE_HSK_LOCAL.exists():
        return json.loads(COMPLETE_HSK_LOCAL.read_text())
    return fetch_json(COMPLETE_HSK_URL)


def load_grammar_text(level_key: str, filename: str) -> str:
    local_file = GRAMMAR_LOCAL_DIR / filename
    if local_file.exists():
        return local_file.read_text(encoding="utf-8")

    remote_name = filename.replace(" ", "%20")
    url = f"{GRAMMAR_REMOTE_BASE}/{remote_name}"
    return fetch_text(url)


def text_to_pinyin(text: str) -> str:
    if not text:
        return ""

    parts: List[str] = []
    last_idx = 0
    for m in HAN_BLOCK_RE.finditer(text):
        if m.start() > last_idx:
            parts.append(text[last_idx : m.start()])

        han_segment = m.group(0)
        py_list = pypinyin(
            han_segment,
            style=Style.TONE,
            heteronym=False,
            strict=False,
            neutral_tone_with_five=False,
        )
        syllables = [item[0] for item in py_list if item and item[0]]
        parts.append(" ".join(syllables))
        last_idx = m.end()

    if last_idx < len(text):
        parts.append(text[last_idx:])

    merged = "".join(parts)
    merged = re.sub(r"\s+([，。！？；：、,.!?;:])", r"\1", merged)
    merged = re.sub(r"\s+", " ", merged).strip()
    return merged


def parse_grammar_points() -> List[Dict]:
    points: List[Dict] = []

    for level_key, filename in GRAMMAR_FILES.items():
        text = load_grammar_text(level_key, filename)
        lines = [ln.strip() for ln in text.splitlines()]

        category = ""
        current = None
        order = 0

        def flush_current():
            nonlocal current
            if not current:
                return
            seen = set()
            cleaned_examples = []
            for e in current["examples"]:
                e = re.sub(r"\s+", " ", e).strip()
                if not e or e in seen:
                    continue
                seen.add(e)
                cleaned_examples.append(e)
                if len(cleaned_examples) >= 4:
                    break
            current["examples"] = cleaned_examples
            current["title_pinyin"] = text_to_pinyin(current["title"])
            current["examples_pinyin"] = [text_to_pinyin(e) for e in current["examples"]]
            points.append(current)
            current = None

        for ln in lines:
            if not ln:
                continue

            if re.match(r"^A\.[\d.\-—ー]+", ln):
                title = re.sub(r"^A\.[\d.\-—ー]+", "", ln).strip()
                if title:
                    category = title
                continue

            m = re.match(r"^【([^】]+)】\s*(.+)$", ln)
            if m:
                flush_current()
                code = m.group(1).replace("—", "-").replace("ー", "-").replace(" ", "")
                order += 1
                current = {
                    "id": f"g-{level_key}-{order:03d}",
                    "level": int(level_key),
                    "level_label": level_key if level_key != "7" else "7-9",
                    "code": code,
                    "title": m.group(2).strip(),
                    "category": category,
                    "examples": [],
                    "source": (
                        "https://github.com/krmanik/HSK-3.0/blob/main/"
                        "New%20HSK%20(2021)/HSK%20Grammar/"
                        f"{filename.replace(' ', '%20')}"
                    ),
                }
                continue

            if current and re.search(r"[\u4e00-\u9fff]", ln):
                # Skip obvious section markers while preserving sentence examples.
                if re.match(r"^A\.", ln):
                    continue
                if ln.startswith("※"):
                    continue
                current["examples"].append(ln)

        flush_current()

    return points


def build_words_and_usage(
    entries: List[Dict],
    char_to_radical: Dict[str, str],
) -> Tuple[Dict[str, List[Dict]], Dict[str, Dict], Dict[str, int]]:
    words_by_level: Dict[str, List[Dict]] = {str(level): [] for level in range(1, 8)}

    usage = defaultdict(
        lambda: {
            "word_counts_by_level": {str(level): 0 for level in range(1, 8)},
            "char_counts_by_level": {str(level): 0 for level in range(1, 8)},
            "examples_by_level": {str(level): [] for level in range(1, 8)},
            "_example_seen": {str(level): set() for level in range(1, 8)},
        }
    )

    word_seq = 1

    for entry in entries:
        levels = sorted(
            [int(v.split("-")[1]) for v in entry.get("level", []) if v.startswith("new-")]
        )
        if not levels:
            continue

        level = levels[0]
        if level < 1 or level > 7:
            continue

        forms = entry.get("forms") or [{}]
        transcriptions = forms[0].get("transcriptions", {}) if forms else {}
        meanings = forms[0].get("meanings", []) if forms else []

        word = entry.get("simplified", "")
        chars = [ch for ch in word if "\u4e00" <= ch <= "\u9fff"]
        radical_ids = [char_to_radical[ch] for ch in chars if ch in char_to_radical]
        radical_unique = sorted(set(radical_ids), key=radical_sort_key)

        word_obj = {
            "id": f"w-{word_seq:06d}",
            "word": word,
            "pinyin": transcriptions.get("pinyin", ""),
            "meaning": meanings[0] if meanings else "",
            "level": level,
            "frequency": int(entry.get("frequency", 999999)),
            "radical_ids": radical_unique,
        }
        words_by_level[str(level)].append(word_obj)
        word_seq += 1

        level_key = str(level)
        for rid in radical_unique:
            usage[rid]["word_counts_by_level"][level_key] += 1
            usage[rid]["char_counts_by_level"][level_key] += radical_ids.count(rid)

            if len(usage[rid]["examples_by_level"][level_key]) >= 10:
                continue
            if word_obj["word"] in usage[rid]["_example_seen"][level_key]:
                continue
            usage[rid]["_example_seen"][level_key].add(word_obj["word"])
            usage[rid]["examples_by_level"][level_key].append(
                {
                    "word": word_obj["word"],
                    "pinyin": word_obj["pinyin"],
                    "meaning": word_obj["meaning"],
                }
            )

    for level in range(1, 8):
        level_key = str(level)
        words_by_level[level_key].sort(key=lambda x: (x["frequency"], x["word"]))

    for info in usage.values():
        info.pop("_example_seen", None)

    word_counts = {str(level): len(words_by_level[str(level)]) for level in range(1, 8)}
    return words_by_level, usage, word_counts


def build_radicals(
    radical_rows: List[Dict[str, str]],
    usage: Dict[str, Dict],
    mandarin: Dict[str, str],
    definition: Dict[str, str],
    strokes: Dict[str, int],
) -> List[Dict]:
    out = []

    for idx, row in enumerate(radical_rows, 1):
        rid = row["id"]
        ideograph = row["ideograph"]
        usage_info = usage.get(
            rid,
            {
                "word_counts_by_level": {str(level): 0 for level in range(1, 8)},
                "char_counts_by_level": {str(level): 0 for level in range(1, 8)},
                "examples_by_level": {str(level): [] for level in range(1, 8)},
            },
        )

        first_level = None
        for level in range(1, 8):
            if usage_info["word_counts_by_level"][str(level)] > 0:
                first_level = level
                break

        out.append(
            {
                "index": idx,
                "id": rid,
                "symbol": row["symbol"],
                "ideograph": ideograph,
                "unicode_name": row["unicode_name"],
                "name": row["unicode_name"].replace("KANGXI RADICAL ", "").replace("CJK RADICAL ", ""),
                "pinyin": mandarin.get(ideograph, ""),
                "definition": definition.get(ideograph, ""),
                "strokes": strokes.get(ideograph),
                "first_hsk_level": first_level,
                "word_counts_by_level": usage_info["word_counts_by_level"],
                "char_counts_by_level": usage_info["char_counts_by_level"],
                "examples_by_level": usage_info["examples_by_level"],
            }
        )

    return out


def build_meta(radicals: List[Dict], words_by_level: Dict[str, List[Dict]], grammar_points: List[Dict]) -> Dict:
    grammar_counts = {str(level): 0 for level in range(1, 8)}
    for point in grammar_points:
        grammar_counts[str(point["level"])] += 1

    by_level = {}
    for level in range(1, 8):
        level_key = str(level)
        introduced = sum(1 for r in radicals if r["first_hsk_level"] == level)
        available = sum(
            1
            for r in radicals
            if r["first_hsk_level"] is not None and r["first_hsk_level"] <= level
        )
        by_level[level_key] = {
            "words": len(words_by_level[level_key]),
            "grammar_points": grammar_counts[level_key],
            "radicals_introduced": introduced,
            "radicals_available_cumulative": available,
        }

    return {
        "generated_at": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "levels": by_level,
        "totals": {
            "radicals": len(radicals),
            "words": sum(len(v) for v in words_by_level.values()),
            "grammar_points": len(grammar_points),
        },
        "sources": {
            "radicals": [
                "https://www.unicode.org/Public/UCD/latest/ucd/CJKRadicals.txt",
                "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip",
            ],
            "words": [
                "https://github.com/drkameleon/complete-hsk-vocabulary",
            ],
            "grammar": [
                "https://github.com/krmanik/HSK-3.0",
                "https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B2%EF%BC%88%E8%AF%8D%E6%B1%87%E3%80%81%E6%B1%89%E5%AD%97%E3%80%81%E8%AF%AD%E6%B3%95%EF%BC%89.pdf",
                "https://github.com/mozillazg/python-pinyin",
            ],
        },
    }


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    print("Loading Unicode radical table...")
    radical_rows = load_cjk_radicals()

    print("Loading Unihan properties...")
    mandarin, definition, char_to_radical, strokes = load_unihan_props()

    print("Loading complete HSK vocabulary...")
    complete_entries = load_complete_hsk_entries()

    print("Building words + radical usage...")
    words_by_level, usage, _word_counts = build_words_and_usage(complete_entries, char_to_radical)

    print("Building radical dataset...")
    radicals = build_radicals(radical_rows, usage, mandarin, definition, strokes)

    print("Parsing grammar dataset...")
    grammar_points = parse_grammar_points()

    print("Building metadata...")
    meta = build_meta(radicals, words_by_level, grammar_points)

    (DATA_DIR / "radicals.json").write_text(
        json.dumps({"radicals": radicals}, ensure_ascii=False, indent=2)
    )
    (DATA_DIR / "words.json").write_text(
        json.dumps({"levels": words_by_level}, ensure_ascii=False, indent=2)
    )
    (DATA_DIR / "grammar.json").write_text(
        json.dumps({"points": grammar_points}, ensure_ascii=False, indent=2)
    )
    (DATA_DIR / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2))

    print("Done")
    print(f"- radicals: {len(radicals)}")
    print(f"- words: {sum(len(v) for v in words_by_level.values())}")
    print(f"- grammar points: {len(grammar_points)}")


if __name__ == "__main__":
    main()
