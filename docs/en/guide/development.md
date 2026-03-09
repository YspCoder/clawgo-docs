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
make build-all
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

That matters when you inspect bundle output, debug initial page load, or package `webui.tar.gz`.

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

- per-platform archives
- `webui.tar.gz`
- `checksums.txt`

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
