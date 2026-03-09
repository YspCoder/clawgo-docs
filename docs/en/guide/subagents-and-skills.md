# Subagents and Skills

## Why Subagents Exist

ClawGo is built for multiple execution roles rather than a single always-do-everything agent.

Typical roles include:

- `main`: orchestration and merge
- `coder`: implementation
- `tester`: testing and verification

Each subagent can have its own:

- `role`
- `display_name`
- `system_prompt_file`
- `memory_namespace`
- `tools.allowlist`
- `runtime` settings

Recent changes make `system_prompt_file` the normal and expected path. Inline prompt editing is no longer the primary workflow.

## Execution Modes

There are two major forms:

### Local subagents

Executed locally with the local provider and local tools.

### Node-backed branches

Mounted through:

```json
{
  "transport": "node",
  "node_id": "edge-dev",
  "parent_agent_id": "main"
}
```

## Tool Permissions

Each subagent can define:

- `tools.allowlist`
- `tools.denylist`
- `tools.max_parallel_calls`

This enables safer role separation, such as:

- `main` focusing on routing and context
- `coder` holding filesystem and shell access
- `tester` holding process management and verification tools

There is now one important exception:

- `skill_exec` is automatically inherited by subagents

So even if it is not listed explicitly in the allowlist, subagents can still execute skills. The `SubagentProfiles` WebUI page now shows this as part of the inherited tool set.

## Skills

Skills are reusable capability packages, typically centered around `SKILL.md`.

The code loads skills from multiple locations:

- workspace skills
- global skills
- builtin skills

The `skill_exec` tool is what exposes those skills to runtime execution. Recent audit changes also add:

- `caller_agent`
- `caller_scope`

That makes it easier to tell whether a skill execution came from the main agent or from a subagent.

The repository currently ships workspace skills such as:

- `tmux`
- `healthcheck`
- `clawhub`
- `context7`
- `github`
- `skill-creator`
- `spec-coding`

## `spec-coding`

The main coding workflow skill in the workspace is now `spec-coding`.

It is intended for non-trivial coding work and keeps three files in the current coding project root:

- `spec.md`
- `tasks.md`
- `checklist.md`

Those files are not meant to live permanently in the ClawGo repository root. They belong to the actual project being changed. The templates come from:

```text
workspace/skills/spec-coding/templates
```

Runtime behavior also now ties into this workflow:

- when the request looks like spec-driven coding, missing `spec.md`, `tasks.md`, and `checklist.md` can be scaffolded automatically
- when coding work completes or gets reopened, `tasks.md` and `checklist.md` can be updated automatically to reflect completion or rework

## Skills CLI

Supported commands include:

- `skills list`
- `skills install`
- `skills remove`
- `skills search`
- `skills show`

## Recommendations

- keep `main` as the orchestrator with a smaller safe tool set
- push high-risk execution into `coder` or `tester`
- define subagent identity with `system_prompt_file` instead of inline prompt text
- keep prompt files under paths such as `agents/<agent_id>/AGENT.md`
- use `spec-coding` for multi-file or multi-stage coding work so `spec.md`, `tasks.md`, and `checklist.md` evolve with the implementation
