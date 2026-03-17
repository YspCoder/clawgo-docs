# Subagents and Skills

## The Current Core Is Still `agents.subagents`

The real structure in the current codebase and `config.example.json` is still:

```text
agents.subagents
```

not the `agents.agents` wording from the earlier docs revision.

## Why Subagents Exist

ClawGo does not push every task through one all-purpose agent.

It splits execution into roles such as:

- `main`
- `coder`
- `tester`
- remote node branches

That keeps the main conversation clean while making internal execution traceable.

## Common Subagent Fields

Each subagent can define:

- `role`
- `display_name`
- `system_prompt_file`
- `memory_namespace`
- `tools.allowlist`
- `runtime.provider`

For the current version, `system_prompt_file` remains the canonical configuration path.

## Execution Modes

There are two main forms:

### Local subagents

Executed directly with local providers and tools.

### Node-backed branches

Configured like:

```json
{
  "transport": "node",
  "node_id": "edge-dev",
  "parent_agent_id": "main"
}
```

This mounts a remote node into the main topology.

## Tool Permissions

Subagents still control tool visibility through:

- `tools.allowlist`
- `tools.denylist`
- `tools.max_parallel_calls`

A common split is:

- `main` gets routing and lookup tools
- `coder` gets filesystem and shell
- `tester` gets verification and process-manager tools

## `spawn` And `subagent_profile`

The current README explicitly keeps two key capabilities:

- `spawn`
- `subagent_profile`

They are used to:

- trigger subagent execution
- create and manage subagent definitions

## Skills

Skills are still centered on `SKILL.md` and exposed through `skill_exec`.

They are still loaded from:

- workspace skills
- global skills
- builtin skills

## `spec-coding`

The main engineering skill is still `spec-coding`.

It targets non-trivial coding work and maintains:

- `spec.md`
- `tasks.md`
- `checklist.md`

in the active coding project root.

## Recommended Practice

- let `main` focus on dispatch and merge
- push risky execution into `coder` and `tester`
- keep role prompts in `AGENT.md`
- attach remote execution through node-backed branches
