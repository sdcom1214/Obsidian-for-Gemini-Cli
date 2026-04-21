# Release Notes

## [v1.7.0] - 2026-04-21 (JS Eval + Web Search Query Upgrade)

### New Features
- Added `js_eval` tool with restricted VM execution, timeout control, and optional input context.
- Enhanced `web_search` arguments with `limit`, `site`, `region/lang`, `timeRange`, and `safeSearch`.
- Added web search metadata output (`finalQuery`, filters) for easier downstream AI traceability.

### Technical Improvements
- Improved DuckDuckGo result parsing with redirect URL decoding and stronger snippet extraction.
- Added input sanitization for domain/region/time-range parameters.
- Added promise timeout handling for async JavaScript evaluation.

---

## [v1.6.0] - 2026-04-21 (Search and Recommendation Upgrade)

### New Features
- Upgraded `search_notes` with phrase matching, folder filtering, richer ranking, and metadata-rich results.
- Replaced static `get_recommendations` text with vault-driven analysis for latest notes, orphan notes, top tags, and suggested note pairs.
- Improved `smart_link` to score both title and content keyword overlap.

### Technical Improvements
- `update_note` and `write_note` now create parent directories before saving.
- Added safer vault path validation and HTTP redirect handling.
- Standardized output for better downstream AI parsing.

---

## [v1.2.0] - 2026-04-20 (Web Search and English-First)
- Added `web_search`.
- Improved `web_clip`.
- Switched logs and source comments to English-first output.

## [v1.1.0] - 2026-04-20 (Mega Update)
- Added Web Clipper, Smart Link, Asset Management, and Auto-backup.

## [v1.0.0] - 2026-04-20 (Initial Release)
- Initial release.
