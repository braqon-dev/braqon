# braqon

BRAQON's business card, right in your terminal.

```sh
npx braqon
```

- Zero dependencies, no network calls, no telemetry. It only prints.
- Respects `NO_COLOR` and `--no-color`; uses true color when your terminal supports it.
- Coming later: a from-scratch Rust CLI in this same repo (`cargo install braqon`).

## Release

Tag `vX.Y.Z` on `main` and the `publish` workflow ships it to npm with
[trusted publishing](https://docs.npmjs.com/trusted-publishers) and provenance. No tokens.

---

MIT © Braian Alberto Quintian Romero · [braqon.dev](https://braqon.dev) · BRAQON™
