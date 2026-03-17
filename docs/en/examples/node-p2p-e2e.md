# Node P2P Historical Note

This page is now kept only as a migration note for older deployments.

The latest `clawgo` upstream revision has removed:

- the node runtime surface
- the node CLI
- node APIs
- `gateway.nodes.*` config
- the older Node P2P / relay / webrtc default path

So this E2E flow is no longer valid for the current default version.

## If You Still Maintain An Older Node/P2P Deployment

The safer approach is:

1. pin your historical tag or fork
2. keep version-specific operational docs with that codebase
3. do not treat this page as a current upstream example

## Recommended Current Example

For the current upstream version, use:

- [Minimal Subagent Example](/en/examples/minimal-world)
