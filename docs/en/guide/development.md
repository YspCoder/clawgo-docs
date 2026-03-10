# Development and Build

## Repository Layout

Use these directories as the main map:

- `cmd/clawgo`: CLI and entrypoint
- `pkg`: core runtime implementation
- `webui`: React console
- `workspace`: default workspace template
- `docs`: in-repo project docs and assets

Recent workspace changes add one especially important coding skill:

- `spec-coding`

Its templates live under:

```text
workspace/skills/spec-coding/templates
```

and include:

- `spec.md`
- `tasks.md`
- `checklist.md`

Those files belong in the current coding project root, not as permanent files in the ClawGo repository root.

## Go Build

Common commands:

```bash
make build
make build-variants
make build-all
make build-all-variants
make build-linux-slim
make test
```

## WebUI Build

```bash
make build-webui
```

This installs dependencies, builds the frontend, and produces `webui/dist`.

Recent WebUI changes moved routes to `React.lazy + Suspense` and added manual chunk splitting in the Vite build. The main named chunks include:

- `react-vendor`
- `motion`
- `icons`

That matters when you inspect bundle output, debug initial page load, or inspect the embedded WebUI assets.

## Embedded Asset Sync

Release builds rely on Go `embed` for workspace templates and WebUI assets.

Related Make targets:

```bash
make sync-embed-workspace
make sync-embed-workspace-base
make sync-embed-webui
make cleanup-embed-workspace
```

## Package and Release

```bash
make package-all
```

This creates:

- per-platform full, no-channel, and single-channel archives
- `checksums.txt`

The release flow now expects artifacts such as:

- `clawgo-<os>-<arch>.tar.gz`
- `clawgo-<os>-<arch>-nochannels.tar.gz`
- `clawgo-<os>-<arch>-<channel>.tar.gz`

Current `<channel>` variants include:

- `telegram`
- `discord`
- `feishu`
- `maixcam`
- `qq`
- `dingtalk`
- `whatsapp`

WebUI is now embedded in the binary, so releases no longer need a separate `webui.tar.gz`.

## Channel-Specific Build Variants

Recent Makefile and release changes add channel-specific build variants.

Key targets:

- `make build-variants`
- `make build-all-variants`
- `make package-all`

Meaning:

- `full`: full channel build
- `none`: all channels omitted, producing the `-nochannels` artifact, but it now also includes `with_tui`
- single-channel variants: keep one channel and omit the others through `omit_<channel>` build tags

That means the current no-channel release is not a "no entrypoint" build. It is aimed more at operator and SSH-oriented usage:

- no external message channels are compiled in
- `clawgo tui` remains available as the terminal UI entrypoint
- it fits local debugging, remote operations, or Gateway/API-only deployments

The install script also now supports:

```bash
./install.sh --variant telegram
```

## Recommended Test Command

```bash
go test ./...
```

## Spec-Driven Coding

Recent agent and workspace changes wire spec-driven coding into the main workflow.

When a request is treated as non-trivial coding work, the runtime can maintain these files in the current project root:

- `spec.md`: scope, goals, decisions, tradeoffs
- `tasks.md`: current task breakdown and progress
- `checklist.md`: final verification gate

Implementation details:

- missing files can be scaffolded from `workspace/skills/spec-coding/templates`
- the context builder treats these files as part of active project context when present
- task completion can update `tasks.md` and `checklist.md`
- rework or regression follow-up can reopen the task and reset the checklist

If you are tracing why the agent created or updated these files, start with:

- `pkg/agent/context.go`
- `pkg/agent/spec_coding.go`
- `workspace/skills/spec-coding/`
