# Agent Engineering Blog — コンテンツ戦略・記事ロードマップ

## 1. ブログの基本方針

### コンセプト

> **Agent Engineering for Senior Software Engineers**

「Agent とは何か」を紹介するだけではなく、Agent を**確率的な実行主体を含むソフトウェアシステム**として捉え、

- 設計
- 実装
- 評価
- セキュリティ
- Observability
- Runtime
- 本番運用

までを Software Engineering の観点から体系的に扱う。

### 基本思想

従来の Software Engineering:

```text
Requirements
    ↓
Code
    ↓
Tests
    ↓
Deploy
```

Agent Engineering:

```text
Goal
 ↓
Agent
 ↓
Plan
 ↓
Tool Calls
 ↓
Environment
 ↓
Observation
 ↓
Adapt
 ↓
Result
```

Agent Engineering では、従来の Software Engineering に加えて以下を扱う。

```text
Model
Prompt
Context
Tools
Memory
Runtime
Sandbox
Evaluation
Observability
Guardrails
Cost
Reliability
```

### ブログのポジショニング

「Agent の最新ニュースを紹介するブログ」ではなく、

> **最新のAgent技術を、Software Engineeringの原理に落として理解・実装・評価するブログ**

を目指す。

---

# 2. Agent Engineeringの4 Layer

Agent を以下の 4 層で整理する。

## Layer 1 — Intelligence

```text
Model
Reasoning
Planning
Context
Memory
```

## Layer 2 — Agency

```text
Agent Loop
Tools
Workflow
Multi-Agent
Autonomy
```

## Layer 3 — Runtime

```text
Harness
Sandbox
State
Queue
Scheduler
Checkpoint
```

## Layer 4 — Production

```text
Eval
Observability
Security
Cost
Reliability
Governance
```

最終的には

> **Agentを賢くする → Agentを動かす → Agentを安全にする → Agentを本番運用する**

までを扱う。

---

# 3. コアカテゴリ

## 3.1 Agent Fundamentals

### 主なテーマ

- Agent とは何か
- LLM Application と Agent の違い
- Workflow vs Agent
- ReAct
- Agent Loop
- Autonomy
- Planning
- Goal Decomposition
- Reflection
- Self-Reflection
- Evaluator-Optimizer
- Reactive Agent vs Planning Agent
- Agent Failure Recovery

### 記事候補

1. LLM Application と Agent は何が違うのか
2. Workflow と Agent の違い
3. Agent Loop をゼロから実装する
4. ReAct Agent を自作する
5. Agent の State Machine 設計
6. Agent の無限ループをどう防ぐか
7. Planning Agent vs Reactive Agent
8. Agent の Goal Decomposition
9. Evaluator-Optimizer Pattern
10. Long-running Agent の設計

### 重要な思想

Agent を、

```text
Reason
  ↓
Plan
  ↓
Act
  ↓
Observe
  ↓
Reason
  ↓
...
```

という**非決定的な制御ループ**として捉える。

---

# 4. Workflow / Orchestration

## 主なテーマ

- DAG
- State Machine
- Workflow
- Agent Loop
- LangGraph
- Temporal
- Durable Execution
- Human-in-the-loop
- Checkpoint
- Resume
- Retry
- Timeout
- Cancellation
- Idempotency
- Saga Pattern
- Failure Recovery

## 記事候補

1. DAG vs Agent Loop
2. Workflow と Agent をどう使い分けるか
3. State Machine として Agent を設計する
4. LangGraph で Agent Workflow を実装する
5. Temporal × AI Agent
6. Durable Execution とは何か
7. Human-in-the-loop Workflow
8. Agent Workflow の Idempotency
9. Agent における Exactly-once / At-least-once
10. Long-running Agent をどう再開可能にするか

### 重要な思想

「Agent だから全部 LLM に任せる」のではなく、

> **決定論的な部分は通常のSoftware Engineeringで制御し、非決定論的な部分だけをLLMに委譲する。**

---

# 5. Agent SDK / Framework

Senior Software Engineer 向けブログとして、ここを独立した大カテゴリにする。

## 対象

- Google ADK
- Claude Agent SDK
- OpenAI Agents SDK
- LangGraph
- PydanticAI
- Microsoft Agent Framework
- その他、今後登場する主要 Agent Framework

## 比較軸

単なる API 比較ではなく、以下の抽象化を比較する。

| 観点              | 比較内容                   |
| ----------------- | -------------------------- |
| Agent Loop        | 誰が実行ループを制御するか |
| State             | Stateの保持・更新方法      |
| Session           | 会話・実行単位             |
| Tool              | Tool abstraction           |
| Handoff           | Agent間委譲                |
| Memory            | Memory abstraction         |
| Persistence       | 状態永続化                 |
| Runtime           | Execution runtime          |
| Retry             | Retry semantics            |
| Timeout           | Timeout / cancellation     |
| Streaming         | Streaming model            |
| Observability     | Trace / logging            |
| Testing           | Testability                |
| Type Safety       | 型安全性                   |
| DI                | Dependency Injection       |
| Human-in-the-loop | Approval / intervention    |
| Deployment        | 本番デプロイ               |
| Extensibility     | Framework extension        |

## 記事候補

1. Google ADK とは何か
2. Claude Agent SDK とは何か
3. OpenAI Agents SDK とは何か
4. LangGraph とは何か
5. PydanticAI とは何か
6. Google ADK vs Claude Agent SDK vs OpenAI Agents SDK
7. LangGraph vs Agent SDK
8. 同じ Agent を 5 つの Framework で実装する
9. Agent Framework は本当に必要なのか
10. Agent Framework の Abstraction Leakage
11. Agent SDK の内部実装をソースコードから読む
12. Google ADK Runner / Session / Event Loop を理解する
13. Claude Agent SDK の Tool Execution を理解する
14. LangGraph の StateGraph / Checkpoint を理解する
15. OpenAI Agents SDK の Handoff を理解する

## 特に重要なシリーズ

### 「同じAgentを5つのFrameworkで作る」

同じ Customer Support Agent を以下で実装する。

- Claude Agent SDK
- Google ADK
- OpenAI Agents SDK
- LangGraph
- PydanticAI

要件例:

```text
User
 ↓
Agent
 ├─ Search Knowledge Base
 ├─ Get Customer
 ├─ Create Ticket
 ├─ Refund
 └─ Escalate to Human
```

比較項目:

- Type safety
- State management
- Dependency Injection
- Error handling
- Retry
- Timeout
- Cancellation
- Streaming
- Observability
- Testing
- Mockability
- Persistence
- Human-in-the-loop
- Deployment
- Extensibility

---

# 6. Tools / Tool Use

## 主なテーマ

- Function Calling
- Tool Calling
- Tool Design
- Tool Description
- Parameter Schema
- Tool Granularity
- Tool Result
- Tool Error
- Tool Permission
- Tool Discovery
- Dynamic Tool Loading
- Tool Selection
- Tool Evaluation
- Side Effects
- Idempotency
- Reversibility

## 記事候補

1. Function Calling の仕組み
2. Tool Calling の設計原則
3. 良い Agent Tool / 悪い Agent Tool
4. Tool Description が Agent 性能に与える影響
5. Tool の粒度はどこまで細かくするべきか
6. Tool Result をどう設計するか
7. Tool Error をどう Agent に返すか
8. Tool Permission
9. Tool Discovery
10. Dynamic Tool Loading
11. Tool Selection
12. Tool Use の Eval
13. Agent Tool Design と REST API Design の違い
14. Tool の Side Effect をどう扱うか
15. Agent における Idempotent Tool

### 重要な問い

> **良いAgent Toolは良いREST APIと何が違うのか？**

Agent Tool では、

- Description
- Parameter schema
- Granularity
- Side effects
- Reversibility
- Permissions
- Error semantics
- Idempotency
- Observability

が LLM の意思決定そのものに影響する。

---

# 7. MCP — Model Context Protocol

MCP は独立した大カテゴリとして扱う。

## Level 1 — Fundamentals

- MCP とは何か
- MCP Host / Client / Server
- JSON-RPC
- Tools
- Resources
- Prompts
- Lifecycle
- Capability

## Level 2 — Implementation

- MCP Server を自作する
- Python MCP Server
- TypeScript MCP Server
- MCP Client を自作する
- Remote MCP
- Authentication
- Authorization
- Transport

## Level 3 — Architecture

- MCP Tool Design
- Tool Inventory
- Dynamic Tool Discovery
- MCP × RAG
- MCP × Database
- MCP × GitHub
- MCP × Slack
- MCP × Browser
- MCP × Coding Agent
- MCP Gateway

## Level 4 — Security

- MCP Security Model
- Prompt Injection
- Indirect Prompt Injection
- Tool Poisoning
- Trust Boundary
- Tool Permission
- Enterprise MCP Architecture

## 比較記事

1. MCP vs Function Calling
2. MCP vs REST API
3. MCP vs OpenAPI
4. MCP は Agent 時代の HTTP なのか？
5. MCP を Enterprise Architecture にどう組み込むか

---

# 8. Context Engineering

Prompt Engineering の次の重要テーマとして扱う。

## 主なテーマ

- Context Window
- Context Engineering
- Context Selection
- Context Prioritization
- Context Compression
- Compaction
- Summarization
- Tool Result Compression
- Context Budget
- Context Cache
- Prompt Cache
- Context Rot
- Long Context vs Retrieval
- Context と Memory の違い

## 記事候補

1. Prompt Engineering vs Context Engineering
2. Context Window とは何か
3. Context Rot とは何か
4. Context Compression
5. Context Compaction
6. Conversation Summarization
7. Tool Result Compression
8. Context Selection
9. Context Prioritization
10. Long Context vs Retrieval
11. Agent の Context Budget
12. Context をいつ捨てるべきか
13. Prompt Cache
14. Context Cache
15. Context と Memory の違い

### 重要な思想

> **Context WindowはAgentのWorking Memoryである。**

したがって、Context を単なる Prompt の長さとしてではなく、Resource Management の問題として扱う。

---

# 9. Memory / Knowledge

## 主なテーマ

- Short-term Memory
- Long-term Memory
- Episodic Memory
- Semantic Memory
- Procedural Memory
- User Memory
- Agent Memory
- Organizational Memory
- Memory Retrieval
- Memory Consolidation
- Memory Compression
- Forgetting
- Vector DB
- Graph DB
- GraphRAG

## 記事候補

1. Agent に Memory は必要なのか
2. Short-term Memory
3. Long-term Memory
4. Episodic Memory
5. Semantic Memory
6. Procedural Memory
7. User Memory vs Agent Memory
8. Memory Retrieval
9. Memory Consolidation
10. Memory Compression
11. Memory Forgetting
12. Vector DB vs Graph DB
13. GraphRAG
14. Organizational Memory
15. Agent Memory Architecture

### 重要な問い

> **Agentに何を覚えさせ、何を忘れさせるべきか？**

---

# 10. Agent Runtime / Harness

元の「Kernel」テーマは主に「Agent Runtime / Agent Harness」として整理する。

## 主なテーマ

- Agent Runtime
- Agent Harness
- Process Lifecycle
- Session
- State
- Event
- Heartbeat
- Cancellation
- Timeout
- Retry
- Checkpoint
- Resume
- Queue
- Scheduler
- Worker
- Supervisor
- Persistence
- Crash Recovery
- Long-running Agent
- Background Agent

## 記事候補

1. Agent Harness とは何か
2. Agent Runtime とは何か
3. Agent Process Lifecycle
4. Heartbeat
5. Cancellation
6. Timeout
7. Pause / Resume
8. Checkpoint
9. State Persistence
10. Long-running Agent
11. Background Agent
12. Agent Supervisor
13. Agent Worker Architecture
14. Agent Queue
15. Agent Scheduler
16. Agent Crash Recovery
17. Agent Runtime と Kubernetes
18. Agent Runtime と Temporal
19. Agent Runtime をゼロから作る

### 重要な思想

Agent を単なる関数呼び出しではなく、

> **長時間動作するプロセス**

として扱う。

---

# 11. Event-driven / Ambient Agent

チャット UI から脱却し、Agent を非同期システムとして捉える。

## 主なテーマ

- Event-driven Agent
- Webhook
- Message Queue
- Event Bus
- Background Processing
- Scheduled Agent
- Ambient Agent
- Proactive Agent
- Notification
- Human Escalation

## 記事候補

1. Chat UI から Ambient Agent へ
2. Webhook で起動する Agent
3. Message Queue × Agent
4. Event-driven Agent Architecture
5. 常駐型 Agent の設計
6. Background Agent
7. Scheduled Agent
8. Proactive Agent
9. Agent × Kafka
10. Agent × SQS
11. Agent × Pub/Sub
12. Agent × Temporal

---

# 12. Sandbox / Computer Use

## 主なテーマ

- Docker
- E2B
- Firecracker
- gVisor
- Filesystem Isolation
- Network Isolation
- Process Isolation
- Code Interpreter
- Browser Agent
- Computer Use
- GUI Agent
- Remote Desktop Agent
- OS Agent

## 記事候補

1. Agent Sandbox とは何か
2. Docker Sandbox
3. E2B
4. Firecracker
5. gVisor
6. Filesystem Isolation
7. Network Isolation
8. Code Interpreter
9. Agent に Shell を与える
10. Agent に Browser を与える
11. Browser Agent
12. Computer Use
13. GUI Agent
14. Agent に OS を与える
15. Sandbox Architecture を比較する

### 重要な思想

Agent の能力を、

```text
Tool
  ↓
Computer
  ↓
Environment
```

と拡張して考える。

---

# 13. Security / Guardrails

Agent は「回答する AI」ではなく「行動する AI」なので、従来の LLM Security とは異なる Authorization モデルが必要になる。

## 主なテーマ

- Prompt Injection
- Indirect Prompt Injection
- Tool Poisoning
- Data Exfiltration
- Excessive Agency
- Privilege Escalation
- Confused Deputy Problem
- Agent Identity
- Agent Authorization
- Least Privilege
- Tool Permission
- Human Approval
- Two-person Rule
- High-risk Action Confirmation
- Reversible vs Irreversible Action
- Sandboxing
- Secret Management
- Audit Log
- Policy Engine

## 記事候補

1. Prompt Injection
2. Indirect Prompt Injection
3. Tool Poisoning
4. Data Exfiltration
5. Excessive Agency
6. Agent Identity
7. Agent Authorization
8. Least Privilege
9. Tool-level Permission
10. Resource-level Permission
11. Human Approval
12. High-risk Action Confirmation
13. Reversible vs Irreversible Action
14. Agent Credential
15. OAuth × Agent
16. Agent Security Architecture
17. AgentDojo を使った Security Evaluation
18. Agent に人間の OAuth Token をそのまま渡していいのか？

## 基本モデル

```text
User
 ↓
Agent Identity
 ↓
Policy
 ↓
Tool Permission
 ↓
Resource Permission
 ↓
Action
```

---

# 14. Evaluation / Benchmark

このカテゴリはブログの看板カテゴリにする。

## 基本思想

従来の LLM:

```text
Prompt
 ↓
Answer
 ↓
Correct?
```

Agent:

```text
Initial State
      ↓
  Agent Actions
      ↓
Tool Calls
      ↓
Environment
      ↓
Final State
```

したがって、

> **Agent Evaluation = State Transition / Task Completion Evaluation**

という視点を持つ。

---

## 14.1 主要Benchmark

| 領域           | Benchmark                    |
| -------------- | ---------------------------- |
| Tool / Action  | τ-bench                      |
| Tool / Action  | τ²-bench                     |
| Web Search     | BrowseComp                   |
| General Agent  | GAIA                         |
| Web Agent      | WebArena                     |
| Computer Use   | OSWorld                      |
| Coding Agent   | SWE-bench                    |
| Coding Agent   | SWE-bench Verified           |
| Coding Agent   | SWE-bench Pro                |
| Security       | AgentDojo                    |
| Tool Use       | Toolathlon                   |
| Research Agent | BrowseComp / Deep Research系 |

## 記事候補

1. Agent Evaluation とは何か
2. LLM-as-a-Judge
3. Agent Trajectory Evaluation
4. Golden Dataset
5. Expected State
6. Tool Trace Evaluation
7. Final State Evaluation
8. pass@k / pass^k
9. Cost / Success Rate
10. Latency / Success Rate
11. Agent Regression Test
12. Agent Benchmark を CI/CD に組み込む

---

# 15. τ-bench / τ²-bench

特に重要な Benchmark として独立して扱う。

τ-bench の特徴は Agent がユーザーと対話しながら Domain-specific API を使い、最終的な Database State を Goal State に到達させられるかを見る点にある。

重要な指標:

- Task Success
- pass^k
- Tool Calls
- Tool Errors
- Cost
- Latency
- Reliability

## 記事候補

1. τ-bench とは何か
2. τ-bench を実際に動かす
3. τ-bench の Task / Tool / Policy を理解する
4. τ-bench で Tool Design を評価する
5. τ-bench で Agent Framework を比較する
6. τ-bench で Model Routing を比較する
7. pass^k から Agent Reliability を考える
8. Cost per Successful Task
9. τ-bench と E2E Test の違い
10. τ²-bench とは何か
11. τ-bench vs τ²-bench

### 特にやりたい実験

```text
Model
  ↓
同じAgent Harness
  ↓
同じTool
  ↓
同じPrompt
  ↓
τ-bench
  ↓
Success Rate
pass^k
Cost
Latency
Tool Error
```

「モデルが 1 回成功したか」ではなく、

> **何度実行しても安定してTaskを完遂できるか**

を見る。

---

# 16. Coding Agent

Senior Software Engineer の読者層と特に相性が良いカテゴリ。

## 対象

- Claude Code
- Codex
- Gemini CLI
- Cursor Agent
- GitHub Copilot Coding Agent
- SWE-bench
- Coding Agent Harness

## 主なテーマ

- Repository Context
- Tool Use
- Shell
- Git
- Test Execution
- Sandbox
- Long-running Coding Agent
- Checkpoint
- Human Approval
- Coding Agent Eval
- SWE-bench

## 記事候補

1. Coding Agent とは何か
2. Coding Agent はなぜ Harness が重要なのか
3. Claude Code の Architecture を考える
4. Codex 系 Coding Agent の設計を考える
5. Repository Context
6. Agent に Shell を与える設計
7. Agent に Git を操作させる
8. Agent に Test を実行させる
9. Coding Agent Sandbox
10. Coding Agent と SWE-bench
11. Coding Agent の Long-running 問題

---

# 17. Observability

Agent は通常の Backend より Debug が難しい。

```text
Request
  ↓
LLM
  ↓
Tool
  ↓
Tool Result
  ↓
LLM
  ↓
Tool
  ↓
Error
  ↓
Retry
  ↓
LLM
  ↓
...
```

## 主なテーマ

- Agent Trace
- OpenTelemetry
- Span
- Tool Call Trace
- Token Usage
- Latency
- Cost
- Retry
- Error Rate
- Agent Trajectory
- Failure Analysis
- Production Dashboard

## 記事候補

1. Agent Observability とは
2. Agent Trace
3. OpenTelemetry で Agent を Tracing する
4. Span 設計
5. Tool Call Trace
6. Token Usage
7. Latency
8. Cost
9. Retry
10. Agent Failure Analysis
11. Agent Trajectory の可視化
12. Production Agent Dashboard

---

# 18. Multi-Agent

Multi-Agent を「複数 Agent を使ってみる」だけで終わらせない。

## 主なテーマ

- Single Agent vs Multi-Agent
- Agent Handoff
- Supervisor Pattern
- Hierarchical Agent
- Parallel Agents
- Planner / Executor
- Debate Agent
- Researcher / Writer
- Swarm
- Agent Communication
- Agent-to-Agent Protocol
- Multi-Agent Failure
- Multi-Agent Cost

## 記事候補

1. Single Agent vs Multi-Agent
2. Agent Handoff
3. Supervisor Pattern
4. Hierarchical Agent
5. Parallel Agents
6. Planner / Executor
7. Swarm
8. Agent Communication
9. Multi-Agent Failure
10. Multi-Agent Cost
11. Multi-Agent vs One Strong Model
12. Multi-Agent が本当に必要なのか

### 基本思想

> **Single Agentで解けない明確な理由がある場合だけMulti-Agentにする。**

---

# 19. Agent Economics

Agent は Model 性能だけではなく、

> **Cost × Latency × Reliability**

で評価する。

## 主なテーマ

- Token Economics
- Reasoning Token
- Tool Call Cost
- Latency Budget
- Model Routing
- Dynamic Model Selection
- SLM + LLM
- Cheap Model / Expensive Model
- Retry Cost
- Parallelism
- Caching
- Prompt Caching
- Cost Optimization
- Cost per Successful Task

## 重要な指標

従来:

```text
Cost / Request
```

Agent:

```text
Cost / Successfully Completed Task
```

## 記事候補

1. Agent の Cost Model
2. Token Economics
3. Agent の Latency Budget
4. Dynamic Model Routing
5. SLM + LLM
6. Retry Cost
7. Parallelism
8. Prompt Caching
9. Agent Cost Optimization
10. Cost per Successful Task

---

# 20. Production Agent Architecture

これまでのカテゴリを統合する最終テーマ。

## 想定Architecture

```text
                    User
                     │
                     ▼
              Agent Gateway
                     │
              ┌──────▼──────┐
              │ Agent Runtime│
              │ / Harness    │
              └──────┬──────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Model        Memory        Tools
        │            │            │
        │            │           MCP
        │            │            │
        └────────────┼────────────┘
                     │
               Sandbox / OS
                     │
                     ▼
              External World

       ┌──────────────────────────┐
       │ Eval / Trace / Security   │
       │ Guardrails / Audit       │
       └──────────────────────────┘
```

## 記事候補

1. Production-ready Agent Architecture
2. Agent API Gateway
3. Agent Runtime
4. Tool Gateway
5. MCP Gateway
6. Memory Service
7. Sandbox
8. Queue
9. Scheduler
10. Observability
11. Eval Pipeline
12. Security Layer
13. Human Approval
14. Audit Log
15. Multi-tenant Agent
16. Agent Versioning
17. Agent Deployment
18. Agent CI/CD
19. Agent Rollback
20. Agent SRE
21. Production-grade Agent Architecture

---

# 21. AgentをDistributed Systemsとして考える

Senior Software Engineer 向けの独自テーマとして積極的に扱う。

```text
             Agent
               │
        ┌──────┼──────┐
        ↓      ↓      ↓
      Model   Tool   Memory
        │      │      │
      Remote Remote Remote
      API     API    DB
```

Agent では従来の Distributed Systems と同じ問題が発生する。

- Timeout
- Retry
- Circuit Breaker
- Idempotency
- Backpressure
- Rate Limit
- Queue
- Eventual Consistency
- Distributed Tracing
- Exactly Once
- At Least Once
- Compensation

## 記事候補

1. Agent は Distributed System なのか
2. Agent における Timeout
3. Agent における Retry
4. Agent における Idempotency
5. Agent の Circuit Breaker
6. Agent の Backpressure
7. Agent Queue Architecture
8. Agent の Eventual Consistency
9. Agent の Exactly-once / At-least-once
10. Agent Failure Recovery
11. Agent と Saga Pattern

### 代表的な問題

```text
Agent
 ↓
create_payment()
 ↓
timeout
 ↓
Agentは成功したか分からない
 ↓
retry
 ↓
double payment?
```

Agent Engineering は LLM だけでなく Distributed Systems Engineering の問題でもある。

---

# 22. Agentの非決定性をSoftware Engineeringする

## 従来

```text
input
 ↓
deterministic code
 ↓
output
```

## Agent

```text
input
 ↓
LLM
 ↓
probabilistic decision
 ↓
tool
 ↓
observation
 ↓
LLM
 ↓
...
```

そのため、

> **Agentをどうテストするか？**

が重要になる。

## 記事候補

- Agent Unit Test
- Agent Integration Test
- Agent E2E Test
- Trajectory Test
- Golden Dataset
- Snapshot Test
- LLM-as-a-Judge
- Deterministic Mock
- Tool Mock
- Model Mock
- Regression Test
- Property-based Testing
- Metamorphic Testing
- Backtesting

---

# 23. Agent EvalをSoftware Testingとして捉える

```text
Unit Test
    ↓
Integration Test
    ↓
E2E Test
    ↓
Agent Trajectory Test
    ↓
Benchmark
    ↓
Production Evaluation
```

## 記事候補

1. Agent Eval は Integration Test の進化形なのか
2. Agent Unit Test の設計
3. Agent Integration Test
4. Agent E2E Test
5. Golden Dataset
6. Agent Regression Test
7. Agent Eval を CI/CD に組み込む
8. LLM-as-a-Judge の限界
9. Agent Trajectory Evaluation
10. State Transition Evaluation

---

# 24. Agent Frameworkの「抽象化」を比較する

Framework 比較では API の書き方ではなく、

> **「Agent executionを誰が制御しているのか？」**

を見る。

```text
                    Control Plane
                         │
             ┌───────────┴───────────┐
             │                       │
       Agent Framework         Workflow Engine
             │                       │
       LLM decides                 Code decides
             │                       │
        probabilistic             deterministic
```

比較軸:

- State management
- Durability
- Retry
- Timeout
- Scheduling
- Compensation
- Human approval
- Failure recovery
- Observability
- Testing

---

# 25. Framework Source Code Deep Dive

Senior Engineer 向けの看板シリーズ。

## 記事候補

- Inside Google ADK: Agent Loop をソースコードから読む
- Inside Google ADK: Runner / Session / Event
- Inside Claude Agent SDK: Tool Execution
- Inside Claude Agent SDK: Permission / Hooks / MCP
- Inside OpenAI Agents SDK: Runner / Handoff / Guardrails
- Inside LangGraph: StateGraph
- Inside LangGraph: Checkpoint
- Inside PydanticAI: Agent / Tool / Dependency Injection

### 基本構成

```text
Public API
    ↓
Internal Abstraction
    ↓
Execution Engine
    ↓
State
    ↓
Tool Invocation
    ↓
LLM
    ↓
Event / Trace
```

可能な限り、

- Public API
- Architecture
- Source Code
- Execution Flow
- Design Decision
- Trade-off

まで追う。

---

# 26. ADR型の記事

Senior Engineer 向けに特に有効。

例:

> **AgentにLangGraphを採用するべきか？**

### Requirements

```text
- Long-running
- Stateful
- Human approval
- Retry
- Durable execution
- Observability
```

### Candidates

```text
LangGraph
Temporal
Google ADK
Claude Agent SDK
OpenAI Agents SDK
```

### Evaluation

```text
State management
Durability
Testing
Deployment
Developer Experience
```

### Decision

```text
採用 / 不採用
```

この形式を積極的に使う。

---

# 27. Agent Engineering Landscape

ブログ内に常時更新するリファレンスページを作る。

## Landscape

```text
                     Agent
                       │
              ┌────────┴────────┐
              │                 │
            OpenAI            Claude
            Agents            Agent SDK
              │                 │
              └────────┬────────┘
                       │
                 Agent Runtime
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    Google ADK     LangGraph      PydanticAI
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                  Infrastructure
                       │
              ┌────────┼────────┐
              ↓        ↓        ↓
           Temporal    MCP      E2B
```

## 月次更新

```text
Agent Engineering Landscape — YYYY-MM
```

追跡対象:

- 新しい Agent SDK
- 新しい Protocol
- 新しい Benchmark
- 新しい Runtime
- 新しい Sandbox
- 新しい Security 研究
- 新しい Agent Architecture
- 新しい Model / Tool Use capability

「このブログを見れば Agent ecosystem の現在地が分かる」状態を目指す。

---

# 28. 海外のAgent思想を追う

単なるニュース紹介ではなく、

> **各社がAgentをどのようなSoftware Architectureとして捉えているか**

を追う。

## Anthropic

重点テーマ:

- Building Effective Agents
- Workflow vs Agent
- Context Engineering
- Agent Harness
- Agent Skills
- Tool Design
- MCP
- Agent Security
- Long-running Agents
- Agent Evals

### 見るべき問い

- Agent と Workflow をどう区別しているか
- Context をどう管理するか
- Tool をどう設計するか
- Long-running Agent をどう動かすか
- Harness とは何か
- Security をどう考えるか

---

# 29. Sierra

Enterprise Agent の観点で追う。

重点テーマ:

- Agent OS
- Enterprise Agent
- Memory
- Action
- Customer Experience
- Long-running interaction
- Multi-channel Agent
- Reliability
- Guardrails
- Human escalation

重要な視点:

> **AIが回答する → AIが企業業務を遂行する**

という転換。

---

# 30. OpenAI

重点テーマ:

- Responses API
- Agents SDK
- Tool Use
- MCP
- Computer Use
- Background Agents
- AgentKit
- Evals
- Trace
- Agent deployment

OpenAI の API そのものを紹介するのではなく、

> **その機能がAgent Architecture上で何を解決しているのか**

を説明する。

---

# 31. 技術記事の3タイプ

記事を以下の 3 タイプに分ける。

## Type A — Deep Dive

技術そのものを深掘り。

例:

- MCP Protocol Deep Dive
- Agent Loop の実装
- Context Compaction の実装
- Agent Runtime Architecture

## Type B — Comparative

同じ問題を複数技術で比較。

例:

- Google ADK vs Claude Agent SDK
- LangGraph vs Temporal
- MCP vs Function Calling
- Single Agent vs Multi-Agent
- E2B vs Docker Sandbox
- RAG vs Agent Memory

## Type C — Experimental

自分で実験してデータを出す。

例:

- Tool Description を変えるとτ-bench の成功率は変わるか？
- Context を半分にすると Agent 性能はどう変わるか？
- Single Agent と Multi-Agent で SWE-bench の Cost/Success Rate を比較
- Model を小さくして Tool Routing だけ大モデルにすると Cost は何%下がるか？
- 5 つの Agent Framework で同一タスクを実行して比較する

特に Type C を増やす。

---

# 32. 最初の30記事ロードマップ

## Foundation

1. LLM Application と Agent の違い
2. Workflow vs Agent
3. Agent Loop をゼロから実装する
4. ReAct Agent を実装する
5. Agent の State Machine 設計

## Framework

6. Google ADK とは何か
7. Claude Agent SDK とは何か
8. OpenAI Agents SDK とは何か
9. LangGraph とは何か
10. PydanticAI とは何か
11. Google ADK vs Claude Agent SDK vs OpenAI Agents SDK
12. LangGraph vs Agent SDK

## Tools / MCP

13. Agent Tool Design
14. Function Calling の内部構造
15. MCP Protocol Deep Dive
16. MCP Server をゼロから実装する
17. MCP vs Function Calling vs REST API

## Context / Runtime

18. Context Engineering
19. Context Compaction
20. Agent Memory
21. Agent Harness とは何か
22. Agent Runtime をゼロから作る
23. Agent × Temporal

## Evaluation

24. Agent Evaluation とは何か
25. τ-bench を実際に動かす
26. τ-bench で Tool Design を評価する
27. SWE-bench を Coding Agent から理解する
28. OSWorld / Computer Agent を理解する
29. AgentDojo で Security を評価する

## Integration

30. Production-grade Agent Architecture

---

# 33. 100記事のロングタームロードマップ

## Fundamentals

1. Agent とは何か
2. Workflow vs Agent
3. ReAct
4. Agent Loop
5. Autonomy
6. Planning
7. Reflection
8. Goal Decomposition

## Architecture

9. DAG
10. State Machine
11. LangGraph
12. Temporal
13. Durable Execution
14. Human-in-the-loop
15. Checkpoint
16. Recovery

## Tools

17. Function Calling
18. Tool Design
19. Tool Result
20. Tool Error
21. Tool Selection
22. Tool Discovery
23. Dynamic Tools
24. Tool Evaluation

## MCP

25. MCP 入門
26. MCP Architecture
27. MCP Server
28. MCP Client
29. Remote MCP
30. MCP Auth
31. MCP Security
32. MCP Tool Design

## Context

33. Context Engineering
34. Context Window
35. Context Compression
36. Compaction
37. Context Selection
38. Context Cache
39. Context Budget
40. Context Rot

## Memory

41. Short-term Memory
42. Long-term Memory
43. Episodic Memory
44. Semantic Memory
45. Procedural Memory
46. Memory Retrieval
47. Memory Consolidation
48. GraphRAG

## Runtime

49. Agent Runtime
50. Agent Harness
51. Heartbeat
52. Scheduler
53. Queue
54. Background Agent
55. Checkpoint
56. Crash Recovery

## Sandbox

57. Docker
58. E2B
59. Firecracker
60. Code Interpreter
61. Browser Agent
62. Computer Use
63. GUI Agent
64. OS Agent

## Security

65. Prompt Injection
66. Indirect Prompt Injection
67. Tool Poisoning
68. Data Exfiltration
69. Excessive Agency
70. Agent Identity
71. Agent Authorization
72. Human Approval

## Evaluation

73. LLM-as-a-Judge
74. Agent Trajectory Eval
75. τ-bench
76. τ²-bench
77. SWE-bench
78. BrowseComp
79. OSWorld
80. GAIA
81. AgentDojo
82. Toolathlon

## Observability

83. Agent Trace
84. OpenTelemetry
85. Tool Call Trace
86. Token Cost
87. Latency
88. Failure Analysis

## Multi-Agent

89. Handoff
90. Supervisor
91. Planner/Executor
92. Parallel Agents
93. Swarm
94. Multi-Agent Economics

## Production

95. Agent CI/CD
96. Agent Versioning
97. Agent Rollback
98. Agent SRE
99. Agent Cost Optimization
100.  Production Agent Architecture

---

# 34. 記事を作るときの基本テンプレート

Senior Software Engineer 向けなので、可能な限り以下の構成を使う。

```text
# Problem

何が問題なのか？

# Background

従来のSoftware Engineeringではどう解いていたか？

# Agent Perspective

Agentでは何が変わるのか？

# Architecture

どのような構成になるか？

# Implementation

実際にコードを書く。

# Internals

Framework / Runtime / Protocolの内部を調べる。

# Experiment

複数条件で実験する。

# Evaluation

Benchmark / Test / Metricsで評価する。

# Trade-offs

何が良くて、何が悪いか？

# Production Considerations

本番環境では何が問題になるか？

# Conclusion

何を採用すべきか？
```

可能なら、

> **Architecture → Implementation → Experiment → Evaluation → Trade-offs**

まで到達する。

---

# 35. ブログの差別化方針

次のような内容は避ける。

> 「○ Agentを作ってみた」

次のような内容を採用する。

> 「○ Agent FrameworkはAgent Loop / State / Tool / Runtimeをどう抽象化しているのか？」

> 「同じAgentをGoogle ADK / Claude Agent SDK / OpenAI Agents SDKで実装すると何が違うのか？」

> 「τ-benchでTool設計の違いを比較するとどうなるか？」

> 「Agent Harnessを変えるとAgentの成功率はどう変わるか？」

> 「Contextを50%削減するとAgent性能とCostはどう変わるか？」

> 「Single AgentとMulti-Agentを同一条件で比較するとどうなるか？」

つまり、

```text
News
 ↓
Architecture
 ↓
Implementation
 ↓
Experiment
 ↓
Benchmark
 ↓
Production
```

という流れを基本とする。

---

# 36. 最終的なブログの思想

このブログで一貫して追う問い:

### 1. Agentとは何か？

> LLM Applicationとの本質的な違いは何か？

### 2. Agentはどう動くのか？

> Loop / Workflow / State / Runtime

### 3. Agentはどう外界と接続するのか？

> Tool / MCP / Computer Use

### 4. Agentはどう記憶するのか？

> Context / Memory / Knowledge

### 5. Agentはどう安全に行動するのか？

> Security / Authorization / Guardrails / Sandbox

### 6. Agentが本当に優れているかどう測るのか？

> Eval / Benchmark / Backtest

### 7. Agentをどう本番運用するのか？

> Runtime / Observability / SRE / Cost

### 8. Agent Frameworkは何を抽象化しているのか？

> Google ADK / Claude Agent SDK / OpenAI Agents SDK / LangGraph / PydanticAI

---

# 37. 最終ポジショニング

目指すのは

> **「Agentの使い方を紹介するブログ」**

ではなく、

> **「AgentをSoftware Engineeringとして研究・実装・評価するブログ」**

。

さらに、

```text
Agent
  +
Software Engineering
  +
Distributed Systems
  +
ML Evaluation
  +
Security
  +
Systems Architecture
```

の交差点を専門領域とする。

この方向なら、読者が Senior Software Engineer であっても、単なる LLM 入門ではなく、**「今までの Software Engineering の知識を Agent 時代にどう適用し直すか」**という価値を提供できる。
