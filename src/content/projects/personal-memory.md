---
title: personal-memory
description: An MCP server for carrying useful context between AI sessions, with persistent Markdown files and reviewable updates.
subtitle: A thread of context between AI sessions.
status: In development
stack: Python · MCP · Markdown · Git
repository: https://github.com/ricard0mat0s/personal-memory
draft: false
order: 1
---
## The problem

AI helps me build software, but the context doesn’t always travel with the work. When I use AI to build my résumé, for example, I still have to supply a summary of projects that I already worked on with AI assistance.

Personal-memory starts with that specific friction: making useful project information available to another session or agent without reconstructing it each time.

## The approach

The project connects agents to persistent Markdown pages through an MCP server. Markdown keeps the information readable outside an AI conversation. The interface separates finding information from changing it:

1. **Search** the permitted memory pages for relevant context.
2. **Read** the current Markdown for a selected page.
3. **Propose** a replacement and inspect the exact diff, without writing to the file.
4. **Apply** the approved proposal, checking that the original page hasn’t changed.

The offline core keeps these operations behind one `MemoryWorkspace` interface. The MCP adapter handles authenticated requests around that core. Search and read share a per-request retrieval budget, rather than adding unlimited context with each tool call. See the [retrieval and proposal contracts](https://github.com/ricard0mat0s/personal-memory/blob/119a2791d18aa78faf4b6afd3f90f3defa833ca3/README.md).

### Where review happens

My intended workflow requires my approval before a proposed change is applied. In the current adapter, a call to `apply_update` with the proposal’s ID represents the authorized caller’s approval. The client is responsible for showing the diff and obtaining that approval; the server does not independently establish that a person reviewed it. Read and write permissions are separate in the [MCP implementation](https://github.com/ricard0mat0s/personal-memory/blob/119a2791d18aa78faf4b6afd3f90f3defa833ca3/src/personal_memory/mcp.py).

## Current status

I’m still building personal-memory. The public implementation includes an offline memory core and authenticated MCP tools for search, read, proposal, and application. Applied updates can be recorded in Git, with only the target page included in the commit.

The repository includes tests for recording a change, refusing a repeated proposal, isolating proposals between callers, and restoring memory when recording fails. Those are inspectable checks in the [application test suite](https://github.com/ricard0mat0s/personal-memory/blob/119a2791d18aa78faf4b6afd3f90f3defa833ca3/tests/mcp/test_apply_update.py), not a measure of real-world adoption.

Pending proposals live in process memory and expire; restarting the server loses them. Authentication also needs a configured token verifier. These boundaries matter when connecting the server to a real client. The [README](https://github.com/ricard0mat0s/personal-memory/blob/119a2791d18aa78faf4b6afd3f90f3defa833ca3/README.md) describes the current setup and behavior.

## Design lessons

Two ideas in the implementation are useful beyond this project:

**A review needs a version.** Approving a change only makes sense against the page that was reviewed. A proposal therefore carries both the diff and a version token; a stale proposal is rejected instead of overwriting newer context. This is part of the [proposal and application contract](https://github.com/ricard0mat0s/personal-memory/blob/119a2791d18aa78faf4b6afd3f90f3defa833ca3/README.md).

**Keep the rules behind a small interface.** Parsing, validation, retrieval, and update rules belong to the memory core. Authentication and transport wrap it. Tests can exercise that boundary with temporary Markdown workspaces. The [architecture notes](https://github.com/ricard0mat0s/personal-memory/blob/119a2791d18aa78faf4b6afd3f90f3defa833ca3/ARCHITECTURE.md) explain this separation.

The question I’m working toward is still the one that started the project: can the next session pick up the context that matters, while I stay in control of what becomes lasting memory?
