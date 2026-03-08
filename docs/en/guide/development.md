# Development and Build

## Repository Layout

Use these directories as the main map:

- `cmd/clawgo`: CLI and entrypoint
- `pkg`: core runtime implementation
- `webui`: React console
- `workspace`: default workspace template
- `docs`: in-repo project docs and assets

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
