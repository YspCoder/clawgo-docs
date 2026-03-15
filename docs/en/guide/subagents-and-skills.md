# Agents, NPCs, and Skills

## The Real Config Center Is Now `agents.agents`

This page keeps the older path for continuity, but the real config surface in code has moved from `agents.subagents` to `agents.agents`.

Each entry can now represent:

- an `agent`
- an `npc`
- a remote `node` branch

That matches the current product model much better than the old “main + coder + tester subagent tree” framing.

## The Difference Between `main`, `agent`, and `npc`

### `main`

`main` is still the primary entrypoint, but it is more accurately the world mind:

- accepts user input
- aggregates actor intents
- arbitrates outcomes
- decides what becomes committed world state

### `agent`

Regular `agent` actors are better for explicit execution roles such as:

- `coder`
- `tester`
- provider-bound tool roles
- branch agents running on remote nodes

Common fields include:

- `type`
- `prompt_file`
- `runtime.provider`
- `tools.allowlist`
- `memory_namespace`

### `npc`

An `npc` is an autonomous world actor. Common fields include:

- `kind: "npc"`
- `persona`
- `home_location`
- `default_goals`
- `perception_scope`
- `world_tags`

The key idea is that NPCs produce intents from their visible slice of the world instead of directly executing arbitrary tools.

## Remote Node Branches Still Fit The Same Model

If an actor runs through a remote node, you can still configure:

```json
{
  "transport": "node",
  "node_id": "edge-dev",
  "parent_agent_id": "main"
}
```

This still lives under `agents.agents.<id>`. It is simply a different runtime class, not a separate subsystem.

## Prompt Files Should Use `prompt_file`

Recent code paths now clearly prefer:

- `prompt_file` for agent identity
- a workspace-relative path
- a non-empty value when the actor is enabled

The recommended convention remains:

```text
agents/<agent_id>/AGENT.md
```

## Tool Permissions

Each actor can still define tool permissions with:

- `tools.allowlist`
- `tools.denylist`
- `tools.max_parallel_calls`

A common engineering split is:

- `main` keeps lower-risk routing and lookup tools
- `coder` gets filesystem, shell, and repo tools
- `tester` gets verification and process-control tools

## Skills Remain An Important Extension Surface

Skills are still centered on `SKILL.md` and exposed through `skill_exec`.

The runtime still loads them from:

- workspace skills
- global skills
- builtin skills

Audit records now also keep:

- `caller_agent`
- `caller_scope`

So you can tell which actor triggered each skill execution.

## `spec-coding`

The most important engineering skill remains `spec-coding`.

It targets non-trivial coding work and maintains these files in the active coding project root:

- `spec.md`
- `tasks.md`
- `checklist.md`

Templates come from:

```text
workspace/skills/spec-coding/templates
```

Recent runtime behavior also integrates with that workflow:

- scaffold missing spec files when needed
- update `tasks.md` and `checklist.md` when work is completed or reopened

## Recommended Practice

- let `main` handle world-level judgment instead of all risky execution
- model execution roles as `agent`
- model autonomous world roles as `npc`
- keep prompts in `prompt_file`
- use `spec-coding` for multi-stage engineering tasks
