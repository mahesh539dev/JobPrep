import React, { useState, useEffect, useRef, useCallback } from "react";
import { Terminal, Target, Brain, MessageSquare, BookOpen, ChevronRight, Check, X, Loader2, Send, RotateCcw, TrendingUp, AlertCircle, Mic, ChevronDown, ChevronUp, Trash2, Plus, ArrowLeft, Zap, Award, Clock } from "lucide-react";

// ============================================================
// MASTER RESUME — baked in permanently
// ============================================================
const MASTER_RESUME = `
Mahesh Annapureddy
Lead Backend Engineer | Developer Platform & Infrastructure | Distributed Systems | Java
Toronto, ON, Canada | linkedin.com/in/mahesh-annapureddy

SUMMARY
Lead Backend Engineer with 8+ years designing and owning backend systems across complex distributed architectures at top-5 Canadian financial institutions. End-to-end delivery owner across 14+ microservices, deep expertise in Java, Spring Boot, Kafka, and cloud-native environments (OpenShift, Kubernetes). Proven track record driving CI/CD automation, reducing developer toil, and leading infrastructure migrations with zero downtime.

CORE COMPETENCIES
- Languages: Java 8/11/17/21 (primary), Python, GraphQL, SQL, PL/SQL, JavaScript
- Backend Frameworks: Spring Boot, Spring Cloud, Spring MVC, Spring Security, Spring Data JPA, Hibernate ORM
- Cloud & Infra: OpenShift (OCP 3.x/4.x), Docker, Kubernetes, Amazon S3, AWS, GCP (familiar)
- CI/CD & DevOps: GitHub Actions, Jenkins CI/CD, multi-environment pipeline automation, zero-downtime deployments
- Messaging & Streaming: Apache Kafka (Expert), Kafka Streams, Avro Schemas, IBM MQ (JMS), SMB Protocol
- Big Data: Apache Spark (Java), Hadoop/HDFS, Hive, Trino — petabyte-scale processing
- Databases: Oracle, MySQL, PostgreSQL, DB2, MongoDB, SQL Server — indexing & sharding
- API & Architecture: RESTful API Design, API Gateway, Microservices, CQRS, SOA, System Design, High Availability, Scalability
- Security & Compliance: MTLS, OAuth 2.0, JWT, Spring Security, LDAP, PCI-DSS, SLA/SLO Compliance
- Leadership: Technical Roadmap, System Design, Code Review, Stakeholder Management, Incident Response & RCA
- AI & Automation: Claude Code, GitHub Copilot (Daily), n8n/Make, LangChain, RAG, Vector DBs (Pinecone/ChromaDB)

PROFESSIONAL EXPERIENCE

Lead Backend Engineer — Capgemini — Top-5 Canadian Bank (Feb 2022 – Present)
Enterprise CRM & Offer Management Platform | Toronto, ON
- Owned end-to-end backend delivery across 14+ microservices over 4.5 years — feature development, technical design, vulnerability remediation, performance tuning, production support.
- Spearheaded zero-downtime OCP 3.x to OCP 4.x platform migration, improving release frequency by 40% and streamlining CI/CD pipelines across Dev, SIT, UAT, Prod.
- Authored system design documentation for event-driven microservice architecture, establishing patterns adopted across multiple engineering squads.
- Re-architected high-volume NAS ingestion system using SMB protocol, processing 1M+ heavy records in under 5 minutes with reliable Kafka delivery.
- Engineered Spring Boot microservices processing 500K+ daily DB2-to-Kafka event streams powering an enterprise CRM offer lifecycle platform for millions of bank clients.
- Designed and governed 15+ Avro schemas establishing contract-first event architecture, reducing integration defects by 35%.
- Led end-to-end production incident response: diagnosed critical pipeline failure from malformed upstream data, preserved 100% of in-flight records via Kafka retry mechanisms, deployed hotfix within 24 hours — zero data loss.
- Secured all inter-service communication via Mutual TLS (MTLS) on Spring Cloud Gateway across a PCI-DSS compliant financial platform.
- Developed Apache Spark jobs processing petabyte-scale Hadoop/HDFS datasets; designed Hive and Trino tables for high-throughput batch analytics.
- Led code reviews for 3+ developers — enforcing standards, catching design anti-patterns, accelerating team growth on Kafka/OpenShift/Spring Boot.
- Leveraged GitHub Copilot and internal AI tools daily for code generation, refactoring, documentation.
Tech: Java 11/8, Spring Boot, Apache Kafka, Apache Spark, Hadoop/HDFS, Hive, Trino, Avro, IBM MQ, Spring Cloud Gateway, OpenShift, Docker, GitHub Actions, DB2, MongoDB, GitHub Copilot

Senior Java Backend Developer — Capgemini — Top-5 Canadian Bank (Jul 2021 – Jan 2022)
Event Synthesizer — Consent Document Processing | Toronto, ON
- Developed Spring Boot microservices orchestrating consent document workflows across IBM MQ and Kafka, maintaining 99.95% uptime.
- Built Spring Scheduler data-retrieval engine syncing daily business rule updates, eliminating manual reconciliation, reducing data-lag by 80%.
- Integrated Amazon S3 async pipeline for consent document payloads; implemented MTLS on Spring Cloud Gateway; deployed via Docker/OpenShift.
Tech: Java 11, Spring Boot, Apache Kafka, IBM MQ, Amazon S3, Spring Cloud Gateway, Docker, OpenShift (OCP 3.x)

Java Backend Developer — Amdocs (Jun 2019 – Jun 2021)
Customer Data Routing Platform | Montreal, QC
- Designed and built Kafka-based customer data routing engine using Spring Boot, segregating/persisting records into target databases via configurable business rules.
- Established Jenkins CI/CD pipelines for multi-environment deployments, cutting manual deployment effort by 60%.
- Engineered full persistence layer with Spring Data JPA/Hibernate ORM; optimized SQL reducing avg DB response time by 25%; implemented OAuth 2.0; 85%+ test coverage via JUnit/Mockito.
Tech: Java 8, Spring Boot, Spring MVC, Spring Data JPA, Spring Security, Apache Kafka, MySQL, Tomcat, Jenkins

Java Developer — BNP Paribas (Feb 2018 – May 2019)
Enterprise SOA Financial Platform | Montreal, QC
- Built enterprise SOA applications integrating Spring MVC, Hibernate ORM, JMS MQ; authored PL/SQL stored procedures on Oracle 12g improving batch execution speed by 30%.
- Maintained 99.9% uptime SLA across multi-environment JBoss EAP 6 deployments.
Tech: Java 7, Spring MVC, Spring Security, Hibernate ORM, Oracle 12g, JMS MQ, JBoss EAP 6

PROJECTS
Pet Insurance Platform — Internal Hackathon — 2nd Place | 4-person team (2024)
- Led backend architecture for complete claim lifecycle (create/modify/close) with JWT auth, MongoDB, RESTful Spring Boot APIs.
- Delivered Angular frontend dashboard for claim viewing/status management.

AI Voice Agent — Appointment Booking System — Personal Project (2025)
- Built voice-enabled AI agent using RAG architecture for appointment booking, customer Q&A, email notifications, integrated with Google Calendar API.
- Pipeline: voice input → STT → LLM reasoning with RAG knowledge base → Google Calendar booking → automated email via SMTP.
- Orchestrated with n8n + LangChain RAG retrieval.

Active AI Infrastructure Projects
- Kafka-native LLM inference pipeline: Spring Boot microservices integrated with Python AI services for LLM workloads on enterprise Kafka infra (In Progress).
- RAG application: OpenAI API + Pinecone + FastAPI + LangChain (In Progress).
- Daily use of Claude Code and GitHub Copilot.

EDUCATION
Bachelor of Computer Science | JNTUA College of Engineering (Autonomous), Pulivendula, India (2017)
`.trim();

// ============================================================
// ============================================================
// API HELPER — calls our own backend, which holds the OpenAI key securely
// and proxies to OpenAI's Responses API (with web_search when requested).
// ============================================================
// In dev, Vite proxies /api to the local server (see vite.config.js dev section
// if added) — in production on Railway, set VITE_API_BASE to the backend's URL,
// or leave empty if frontend+backend are served from the same Railway service.
const API_BASE = import.meta.env.VITE_API_BASE || "";

async function callClaude({ system, messages, useSearch = false, maxTokens = 4000 }) {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages, useSearch, maxTokens }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(`API request failed: ${res.status} ${errBody.error || ""}`);
  }
  const data = await res.json();
  if (!data.text) throw new Error("No text content in response");
  return { text: data.text, stopReason: data.stopReason };
}

function extractJSON(text) {
  let t = text.trim();
  // strip markdown fences anywhere, not just at the very start/end
  t = t.replace(/```json\s*/gi, "").replace(/```\s*/g, "");
  t = t.trim();

  const firstBraceCandidates = [t.indexOf("{"), t.indexOf("[")].filter((i) => i !== -1);
  if (firstBraceCandidates.length === 0) {
    throw new Error("No JSON object/array found in response. Raw text started with: " + t.slice(0, 150));
  }
  const firstBrace = Math.min(...firstBraceCandidates);
  if (firstBrace > 0) t = t.slice(firstBrace);

  const lastBrace = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (lastBrace !== -1) t = t.slice(0, lastBrace + 1);

  const attempts = [
    (s) => s,
    (s) => s.replace(/,(\s*[\]}])/g, "$1"), // trailing commas
    (s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""), // stray control chars
    (s) => s.replace(/,(\s*[\]}])/g, "$1").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""),
  ];

  for (const fix of attempts) {
    try {
      return JSON.parse(fix(t));
    } catch (e) {
      continue;
    }
  }

  // last resort: if it looks truncated (no closing bracket matches opening), try closing it off
  try {
    const openBraces = (t.match(/\{/g) || []).length;
    const closeBraces = (t.match(/\}/g) || []).length;
    const openBrackets = (t.match(/\[/g) || []).length;
    const closeBrackets = (t.match(/\]/g) || []).length;
    let patched = t;
    if (closeBraces < openBraces) patched += "}".repeat(openBraces - closeBraces);
    if (closeBrackets < openBrackets) patched += "]".repeat(openBrackets - closeBrackets);
    return JSON.parse(patched);
  } catch (e) {
    throw new Error("Could not parse JSON response. Response may have been cut off or contained extra text. First 200 chars: " + t.slice(0, 200));
  }
}

// ============================================================
// SUPABASE STORAGE LAYER (replaces window.storage — syncs across devices)
// ============================================================
const SUPABASE_URL = "https://kolksmnextmiuawdcluv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbGtzbW5leHRtaXVhd2RjbHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MTQ0MDMsImV4cCI6MjA5NzQ5MDQwM30.R_8KmQ2Z9CiR-5KIMmGXI0u4LOAvxlYeOWgv7Mbbb50";
const SB_TABLE = "interview_prep_kv";

const sbHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function storeGet(key, fallback = null) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${SB_TABLE}?key=eq.${encodeURIComponent(key)}&select=value`,
      { headers: sbHeaders }
    );
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error(`storeGet failed for "${key}": ${res.status} ${t}`);
      window.__lastStorageError = `GET ${key} → ${res.status}: ${t}`;
      return fallback;
    }
    const rows = await res.json();
    if (!rows || rows.length === 0) return fallback;
    return rows[0].value;
  } catch (e) {
    console.error("storeGet network error", key, e);
    window.__lastStorageError = `GET ${key} → network error: ${e.message}`;
    return fallback;
  }
}

async function storeSet(key, value) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SB_TABLE}`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify([{ key, value, updated_at: new Date().toISOString() }]),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error(`storeSet failed for "${key}": ${res.status} ${t}`);
      window.__lastStorageError = `SET ${key} → ${res.status}: ${t}`;
      return false;
    }
    return true;
  } catch (e) {
    console.error("storeSet network error", key, e);
    window.__lastStorageError = `SET ${key} → network error: ${e.message}`;
    return false;
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ============================================================
// SHARED UI BITS
// ============================================================
const C = {
  bg: "#0a0e0f",
  panel: "#11171a",
  panel2: "#161d21",
  border: "#222c30",
  borderLight: "#2c393f",
  text: "#dde6e8",
  textDim: "#7e9197",
  textFaint: "#52656b",
  green: "#3ddc97",
  amber: "#e8a23d",
  red: "#e85d5d",
  blue: "#5db8e8",
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace",
  sans: "'Inter', -apple-system, system-ui, sans-serif",
};

function Eyebrow({ children, color = C.textFaint }) {
  return (
    <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
      {children}
    </div>
  );
}

function StatusDot({ color }) {
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 6px ${color}` }} />;
}

function Btn({ children, onClick, variant = "primary", disabled, style = {}, icon: Icon, full }) {
  const base = {
    fontFamily: C.mono,
    fontSize: 13,
    fontWeight: 500,
    padding: "10px 18px",
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "1px solid transparent",
    transition: "all 0.15s ease",
    opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto",
    letterSpacing: "0.01em",
  };
  const variants = {
    primary: { background: C.green, color: "#0a0e0f", fontWeight: 600 },
    secondary: { background: "transparent", color: C.text, border: `1px solid ${C.borderLight}` },
    ghost: { background: "transparent", color: C.textDim },
    danger: { background: "transparent", color: C.red, border: `1px solid ${C.red}33` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function Panel({ children, style = {} }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function LoadingLine({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: C.mono, fontSize: 13, color: C.textDim }}>
      <Loader2 size={14} className="spin" style={{ color: C.green }} />
      {text}
    </div>
  );
}

// ============================================================
// GENERAL LEARNING — static, hand-written, stable across reloads
// Not regenerated by API. Edit this content directly to update it.
// ============================================================
const GENERAL_LEARNING = {
  categories: [
    {
      id: "java-jvm",
      title: "Java & JVM Internals",
      level: "fundamentals → advanced",
      topics: [
        { topic: "JVM Memory Model", notes: "Heap (Young Gen: Eden + 2 Survivor spaces, Old Gen) vs Stack (per-thread, holds local vars and call frames) vs Metaspace (class metadata, replaced PermGen since Java 8). Objects are allocated in Eden; minor GC promotes survivors; objects surviving enough cycles get tenured to Old Gen. Stack overflows are per-thread; OutOfMemoryError can come from heap, metaspace, or native memory." },
        { topic: "Garbage Collection", notes: "G1GC is the default since Java 9 — divides heap into regions, prioritizes regions with most garbage (Garbage First). ZGC and Shenandoah are low-latency collectors (sub-millisecond pauses) for large heaps. Know the difference between minor GC (young gen, frequent, fast) and major/full GC (whole heap, stop-the-world, expensive). Be ready to discuss GC tuning you've actually done — heap sizing, choosing a collector for throughput vs latency." },
        { topic: "HashMap Internals", notes: "Backed by an array of buckets (Node<K,V>[]), each holding a linked list or, since Java 8, a red-black tree once a bucket exceeds 8 entries (treeification) for O(log n) worst case instead of O(n). hashCode() determines bucket via (n-1) & hash; equals() resolves collisions within a bucket. Resizing (load factor default 0.75) doubles capacity and rehashes. Not thread-safe — use ConcurrentHashMap for concurrent access, which uses CAS operations and segment-level (now node-level) locking." },
        { topic: "Concurrency: synchronized vs Locks vs Atomic", notes: "synchronized is a built-in monitor lock — simple but coarse-grained, can't be interrupted or timed. java.util.concurrent.locks.ReentrantLock offers tryLock, fairness policies, and interruptible locking. Atomic classes (AtomicInteger, AtomicReference) use CAS (compare-and-swap) for lock-free thread safety on single variables — much cheaper than locking for simple counters. Know when each is appropriate and the cost tradeoffs." },
        { topic: "Java Memory Model & volatile", notes: "The JMM defines happens-before relationships that guarantee visibility and ordering across threads. volatile guarantees visibility (writes are immediately visible to other threads) and prevents instruction reordering around it, but does NOT guarantee atomicity for compound operations like i++. final fields have special initialization safety guarantees in constructors." },
        { topic: "Streams & Functional Style", notes: "Stream API (map, filter, reduce, collect) — lazy evaluation, intermediate ops don't execute until a terminal op is called. Understand parallel streams' tradeoffs: good for CPU-bound, large datasets with no shared mutable state; bad for small datasets or I/O-bound work due to fork-join overhead." },
        { topic: "Class Loading", notes: "Bootstrap → Extension/Platform → Application/System class loaders, delegation model (child asks parent first). Useful for explaining ClassNotFoundException vs NoClassDefFoundError, and relevant when discussing modular deployments or classpath conflicts in microservices." },
      ],
    },
    {
      id: "spring",
      title: "Spring Boot & Spring Ecosystem",
      level: "fundamentals → advanced",
      topics: [
        { topic: "IoC & Dependency Injection", notes: "Spring's ApplicationContext manages bean lifecycle: instantiate → populate properties → aware interfaces → BeanPostProcessor (before/after init) → InitializingBean/@PostConstruct → ready → @PreDestroy on shutdown. Constructor injection is preferred over field injection for immutability and easier testing." },
        { topic: "Spring Boot Auto-Configuration", notes: "Driven by @EnableAutoConfiguration scanning META-INF/spring.factories (or AutoConfiguration.imports in newer versions) for conditional beans (@ConditionalOnClass, @ConditionalOnMissingBean). Understanding this matters for explaining why a starter dependency 'just works' and how to override defaults." },
        { topic: "Spring Cloud Gateway", notes: "Reactive, non-blocking API gateway built on Project Reactor/Netty. Routes defined via predicates (path, header, method) and filters (auth, rate limiting, request rewriting). Common in microservices for centralizing cross-cutting concerns like MTLS termination, auth, and routing — directly relevant if you've secured inter-service comms here." },
        { topic: "Spring Data JPA & Hibernate", notes: "JPA is the spec, Hibernate the most common implementation. Know N+1 query problems and fixes (JOIN FETCH, @EntityGraph, batch fetching), lazy vs eager loading tradeoffs, first-level (session) vs second-level (shared) cache, and the persistence context / dirty checking mechanism." },
        { topic: "Spring Security & OAuth2/JWT", notes: "Filter chain architecture — requests pass through a chain of security filters before reaching the controller. JWT: stateless, self-contained tokens (header.payload.signature), validated via signature without a DB lookup — good for scaling stateless services but harder to revoke before expiry (mitigated with short TTLs + refresh tokens or a blocklist). OAuth2 flows: authorization code (web apps), client credentials (service-to-service)." },
        { topic: "Transaction Management (@Transactional)", notes: "Proxy-based (AOP) — self-invocation within the same class bypasses the proxy and silently skips transactional behavior, a classic gotcha. Propagation types (REQUIRED, REQUIRES_NEW, NESTED) and isolation levels matter for correctness in concurrent financial systems specifically." },
      ],
    },
    {
      id: "kafka",
      title: "Apache Kafka (Expert-Level Focus)",
      level: "fundamentals → advanced",
      topics: [
        { topic: "Core Architecture", notes: "Topics split into partitions for parallelism; each partition is an append-only, ordered log. Brokers store partitions; replication (replication factor) provides fault tolerance via leader + followers (ISR — in-sync replicas). Producers choose partitioning via key hash (default) or custom partitioner; consumers in a group split partitions among themselves (one partition per consumer max within a group)." },
        { topic: "Delivery Semantics", notes: "At-most-once (no retry, possible loss), at-least-once (retry on failure, possible duplicates — most common default), exactly-once (idempotent producer + transactional API, prevents duplicates across producer retries and consume-process-produce chains). Be ready to explain which you've used and why, and how you handle duplicate detection downstream if not using EOS." },
        { topic: "Consumer Offset Management", notes: "Offsets track per-partition read position, stored in the internal __consumer_offsets topic. Auto-commit (risk of message loss or duplication depending on timing) vs manual commit (commitSync for reliability, commitAsync for throughput). Rebalancing (when consumers join/leave a group) pauses consumption briefly — cooperative sticky assignor minimizes this disruption vs the older eager rebalance." },
        { topic: "Schema Evolution with Avro", notes: "Avro schemas + a Schema Registry enforce contract-first design between producers and consumers. Backward compatibility (new schema can read old data — add optional fields with defaults) vs forward compatibility (old schema can read new data) vs full compatibility (both). Governing schemas centrally (as you have with 15+ schemas) is what prevents the integration defects that ungoverned JSON payloads cause." },
        { topic: "Kafka Streams vs Consumer API", notes: "Kafka Streams gives you stateful stream processing (joins, windowed aggregations, KTable/KStream abstractions) with exactly-once processing built in, vs hand-rolling consume-process-produce loops with the plain consumer/producer API. Know when the extra abstraction is worth it (complex stream topology) vs overkill (simple passthrough)." },
        { topic: "Retry & Dead Letter Queues", notes: "For poison messages (malformed data that repeatedly fails processing), a DLQ pattern routes failed messages to a separate topic after N retries rather than blocking the partition indefinitely. Directly relevant to your incident response story — preserving in-flight records via retry mechanisms during a malformed-data failure." },
        { topic: "Throughput & Partition Sizing", notes: "More partitions = more parallelism but also more open file handles, longer rebalances, and higher replication overhead. Partition count should be sized for target throughput ÷ per-partition throughput, with headroom for consumer group scaling — a concrete number you should be ready to reason through given your 500K+ daily event experience." },
      ],
    },
    {
      id: "distributed-systems",
      title: "Distributed Systems & System Design",
      level: "advanced / lead-level",
      topics: [
        { topic: "CAP Theorem in Practice", notes: "You can't have all of Consistency, Availability, and Partition tolerance during a network partition — pick 2. Most real systems are CP or AP by design choice, not a binary toggle; e.g. a banking ledger leans CP (reject writes during a partition rather than risk inconsistency), while a CDN or cache leans AP. Be ready to map this to a system you've actually built." },
        { topic: "Idempotency", notes: "Critical for at-least-once delivery systems. Implement via idempotency keys (client-generated unique ID per logical operation, deduped server-side), or natural idempotency (PUT with full resource state, UPSERT patterns). Directly relevant to Kafka retry-driven duplicate handling." },
        { topic: "Event-Driven Architecture Patterns", notes: "Event notification (thin event, consumer fetches details) vs event-carried state transfer (fat event, full payload, reduces coupling but increases payload size) vs event sourcing (state is derived by replaying an event log, not stored directly). Choreography (services react to events independently) vs orchestration (central coordinator) for distributed workflows/sagas." },
        { topic: "CQRS", notes: "Separate models for writes (commands) and reads (queries) — lets you optimize read models independently (denormalized views, caching, different storage) from the write model's consistency requirements. Often paired with event sourcing but doesn't require it. Worth discussing tradeoffs: eventual consistency between write and read sides, added complexity." },
        { topic: "Circuit Breakers & Resilience", notes: "Pattern (e.g. Resilience4j, Hystrix-successor) to stop calling a failing downstream dependency after a failure threshold, fail fast, then probe periodically (half-open state) to test recovery. Pairs with retries-with-backoff and bulkheads (isolating thread pools per dependency so one slow dependency doesn't exhaust all threads)." },
        { topic: "Consistent Hashing", notes: "Used for distributing data/load across nodes (e.g. Kafka partition assignment, distributed caches) such that adding/removing a node only remaps a small fraction of keys, instead of a full rehash. Good to know conceptually even if you haven't implemented it from scratch." },
        { topic: "Designing for High Availability", notes: "Multi-AZ/region deployment, health checks + automated failover, graceful degradation (serve stale/cached data rather than fail outright), and the difference between SLA (contractual), SLO (internal target), and SLI (the actual measured metric) — all directly relevant to PCI-DSS / financial SLA work." },
      ],
    },
    {
      id: "databases",
      title: "Databases & Data at Scale",
      level: "fundamentals → advanced",
      topics: [
        { topic: "Indexing Strategy", notes: "B-tree indexes (default, good for range queries and equality) vs hash indexes (equality only, faster lookups) vs composite indexes (column order matters — leftmost prefix rule). Over-indexing slows writes; under-indexing slows reads — explain a real tradeoff you've made." },
        { topic: "Sharding vs Replication", notes: "Sharding splits data horizontally across nodes (scales writes, adds query complexity for cross-shard joins). Replication copies the same data for read scaling and fault tolerance (doesn't help write throughput). Many systems combine both — sharded with replicas per shard." },
        { topic: "ACID vs BASE", notes: "ACID (Atomicity, Consistency, Isolation, Durability) — traditional RDBMS guarantee, important for financial transactions. BASE (Basically Available, Soft state, Eventual consistency) — common in distributed NoSQL systems trading strict consistency for availability/partition tolerance. Know which your systems need and why (you'd lean ACID for ledger-adjacent work, BASE might be fine for a read-heavy cache)." },
        { topic: "Isolation Levels", notes: "Read Uncommitted → Read Committed → Repeatable Read → Serializable, each preventing more anomalies (dirty reads, non-repeatable reads, phantom reads) at the cost of more locking/contention. Most production systems default to Read Committed; Serializable is rare due to throughput cost." },
        { topic: "Big Data: Spark, Hive, Trino", notes: "Spark: in-memory distributed processing, DAG-based execution, good for iterative/complex transforms over Hadoop's MapReduce. Hive: SQL-like interface over HDFS data, schema-on-read, optimized for batch analytics not low-latency queries. Trino (formerly PrestoSQL): federated, low-latency SQL query engine across multiple data sources — good for interactive analytics. Know when you'd reach for each." },
      ],
    },
    {
      id: "cloud-native",
      title: "Cloud-Native & DevOps",
      level: "fundamentals → advanced",
      topics: [
        { topic: "Kubernetes/OpenShift Core Concepts", notes: "Pods (smallest deployable unit, one or more containers) → ReplicaSets (maintain pod count) → Deployments (manage rollout strategy: rolling update, blue-green, canary) → Services (stable network identity + load balancing) → Ingress (external routing). OpenShift adds enterprise features on top of vanilla K8s — Routes (similar to Ingress), built-in CI/CD (BuildConfigs), tighter RBAC/security defaults." },
        { topic: "Zero-Downtime Deployments", notes: "Rolling updates with readiness probes (don't route traffic until the new pod is actually ready) and liveness probes (restart unhealthy pods) are the baseline. Blue-green (full duplicate environment, instant cutover, easy rollback, costs 2x resources during cutover) vs canary (gradual traffic shift, catches issues on a small percentage first) — be ready to explain which you used for your OCP 3→4 migration and why." },
        { topic: "Docker Fundamentals", notes: "Layered filesystem (each instruction in a Dockerfile creates a cacheable layer — order matters for build speed), multi-stage builds (separate build and runtime images to shrink final image size), and the difference between an image (immutable template) and a container (running instance)." },
        { topic: "CI/CD Pipeline Design", notes: "Multi-environment promotion (Dev → SIT → UAT → Prod) typically gates each stage behind automated tests and sometimes manual approval. Key practices: immutable artifacts (build once, promote the same artifact through environments rather than rebuilding), automated rollback triggers, and pipeline-as-code (Jenkinsfile, GitHub Actions YAML) for repeatability and auditability." },
        { topic: "Observability: Logs, Metrics, Traces", notes: "Logs (discrete events, good for debugging specific failures), metrics (aggregated numeric time series, good for trends/alerting — e.g. Prometheus), traces (request flow across services, good for latency diagnosis in microservices — e.g. distributed tracing via OpenTelemetry). A mature platform team needs all three, not just logs." },
      ],
    },
    {
      id: "security",
      title: "Security & Compliance",
      level: "fundamentals → advanced",
      topics: [
        { topic: "MTLS (Mutual TLS)", notes: "Both client and server present certificates and verify each other (vs standard TLS where only the server is verified). Used for service-to-service auth inside a trust boundary (e.g. via a service mesh or gateway) without needing app-level credentials for every call — strong fit for PCI-DSS environments where you need strong identity guarantees between internal services." },
        { topic: "OAuth2 vs JWT — They're Not the Same Thing", notes: "OAuth2 is an authorization framework (flows for getting a token). JWT is a token format (a way of encoding claims). You can use OAuth2 with opaque tokens (not JWT) or JWT outside of OAuth2 entirely. Be precise about this distinction — interviewers notice when candidates conflate them." },
        { topic: "PCI-DSS Practical Implications", notes: "Key engineering-relevant requirements: encrypt cardholder data in transit and at rest, strong access control (least privilege, MFA for admin access), network segmentation (isolate the cardholder data environment), logging/monitoring of access to sensitive data, and regular vulnerability scanning. Speak to how your MTLS and Spring Security work mapped to these in practice." },
        { topic: "Common Vulnerability Classes", notes: "Be ready to discuss: injection (SQL, even in a microservices world via untrusted input to queries), broken authentication/session management, sensitive data exposure (e.g. logging PII or secrets), insecure deserialization (relevant to Java specifically — untrusted object streams), and dependency vulnerabilities (the kind your 'vulnerability remediation' work addressed)." },
      ],
    },
    {
      id: "ai-infra",
      title: "AI Infrastructure (Your Transition Target)",
      level: "foundational for your career pivot",
      topics: [
        { topic: "RAG (Retrieval-Augmented Generation)", notes: "Pipeline: embed documents into vectors (via an embedding model) → store in a vector DB (Pinecone, ChromaDB, pgvector) → at query time, embed the user query, retrieve top-k similar chunks via cosine similarity/ANN search, inject as context into the LLM prompt. Key tradeoffs: chunk size (too small loses context, too large dilutes relevance), retrieval quality (the bottleneck is usually retrieval, not generation), and hybrid search (combining keyword + semantic search often beats pure vector search)." },
        { topic: "Vector Databases", notes: "Use approximate nearest neighbor (ANN) algorithms like HNSW (Hierarchical Navigable Small World) for fast similarity search at scale, trading perfect recall for speed. Pinecone is managed/hosted; ChromaDB is lightweight/embeddable for smaller scale or local dev; pgvector adds vector search to Postgres — good if you want to keep vectors alongside relational data you already manage." },
        { topic: "LLM Inference Serving", notes: "vLLM and similar serving frameworks use techniques like PagedAttention (memory-efficient KV-cache management, analogous to OS virtual memory paging) and continuous batching (dynamically batch requests instead of static batching) to maximize throughput. Ollama is more for local/dev model serving, not production-scale inference." },
        { topic: "Your Differentiator: Kafka + AI", notes: "Most pure Python AI engineers have never operated a 500K+ events/day production Kafka pipeline under PCI-DSS constraints. Your edge is bridging event-driven backend infrastructure with AI workloads — e.g. a Kafka-native LLM inference pipeline where events trigger or feed AI processing, with the reliability/retry/schema-governance discipline that AI-only engineers typically lack. Lead with this explicitly in interviews rather than competing head-on with pure ML backgrounds." },
        { topic: "LangChain / LangGraph Orchestration", notes: "LangChain provides composable building blocks (chains, agents, retrievers, memory). LangGraph extends this for stateful, multi-step agent workflows with explicit control flow (graphs of nodes/edges) — useful when an agent needs to loop, branch, or maintain complex state, which a simple chain can't express cleanly." },
      ],
    },
  ],
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("home"); // home, general-learning, quiz, research, mock, notes
  const [profiles, setProfiles] = useState([]); // list of {id, company, role, jd, createdAt}
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    (async () => {
      // Connection diagnostic: do a real write+read round trip so we know
      // immediately if Supabase is reachable, instead of failing silently later.
      const testKey = "__connection_test__";
      const testValue = { ts: Date.now() };
      const wrote = await storeSet(testKey, testValue);
      if (!wrote) {
        setDbError(window.__lastStorageError || "Could not write to database (unknown error)");
      } else {
        const readBack = await storeGet(testKey, null);
        if (!readBack) {
          setDbError(window.__lastStorageError || "Wrote test data but could not read it back");
        }
      }

      const p = await storeGet("profiles", []);
      setProfiles(p || []);
      setLoaded(true);
    })();
  }, []);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null;

  async function saveProfiles(next) {
    setProfiles(next);
    await storeSet("profiles", next);
  }

  async function createProfile({ company, role, jd }) {
    const np = { id: uid(), company, role, jd, createdAt: Date.now() };
    const next = [np, ...profiles];
    await saveProfiles(next);
    setActiveProfileId(np.id);
    return np.id;
  }

  async function deleteProfile(id) {
    const next = profiles.filter((p) => p.id !== id);
    await saveProfiles(next);
    // clean up associated data
    await storeSet(`quiz:${id}`, null);
    await storeSet(`research:${id}`, null);
    await storeSet(`mock:${id}`, null);
    await storeSet(`notes:${id}`, null);
    if (activeProfileId === id) setActiveProfileId(null);
  }

  if (!loaded) {
    return (
      <div style={{ background: C.bg, minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingLine text="Initializing..." />
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: 600, fontFamily: C.sans, color: C.text }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        * { box-sizing: border-box; }
        ::selection { background: ${C.green}33; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.borderLight}; border-radius: 4px; }
        textarea, input { outline: none; }
        textarea:focus, input:focus { border-color: ${C.green} !important; }
        button:focus-visible { outline: 2px solid ${C.green}; outline-offset: 2px; }
      `}</style>

      <TopBar
        screen={screen}
        setScreen={setScreen}
        activeProfile={activeProfile}
        onBackHome={() => { setScreen("home"); }}
      />

      {dbError && (
        <div style={{ maxWidth: 980, margin: "16px auto 0", padding: "0 20px" }}>
          <div style={{ background: `${C.red}14`, border: `1px solid ${C.red}55`, borderRadius: 6, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <AlertCircle size={16} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.red, marginBottom: 4 }}>Database connection problem — nothing will save right now</div>
              <div style={{ fontSize: 12, color: C.textDim, fontFamily: C.mono, lineHeight: 1.6 }}>{dbError}</div>
              <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 6 }}>
                Likely causes: the setup SQL wasn't run yet, the table name doesn't match, or a row-level security policy is blocking the anon key. Check Supabase → Table Editor → interview_prep_kv exists, and Authentication → Policies allows the anon role.
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px 80px" }}>
        {screen === "home" && (
          <Home
            profiles={profiles}
            onSelect={(id) => { setActiveProfileId(id); setScreen("dashboard"); }}
            onCreate={createProfile}
            onDelete={deleteProfile}
          />
        )}
        {screen === "general-learning" && <GeneralLearning />}
        {screen === "dashboard" && activeProfile && (
          <Dashboard profile={activeProfile} setScreen={setScreen} />
        )}
        {screen === "quiz" && activeProfile && <QuizMode profile={activeProfile} />}
        {screen === "research" && activeProfile && <ResearchMode profile={activeProfile} />}
        {screen === "mock" && activeProfile && <MockInterviewMode profile={activeProfile} />}
        {screen === "notes" && activeProfile && <NotesMode profile={activeProfile} />}
      </div>
    </div>
  );
}

// ============================================================
// TOP BAR
// ============================================================
function TopBar({ screen, setScreen, activeProfile, onBackHome }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.bg, zIndex: 10 }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={onBackHome} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Terminal size={16} color="#0a0e0f" strokeWidth={2.5} />
          </div>
          <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
            interview<span style={{ color: C.green }}>.prep</span>
          </div>
        </div>
        {activeProfile && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: C.mono, fontSize: 12, color: C.textDim }}>
            <span style={{ color: C.textFaint }}>target:</span>
            <span style={{ color: C.text }}>{activeProfile.role}</span>
            <span style={{ color: C.textFaint }}>@</span>
            <span style={{ color: C.green }}>{activeProfile.company}</span>
          </div>
        )}
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px 12px", display: "flex", gap: 4, flexWrap: "wrap" }}>
        <NavTab active={screen === "home"} onClick={onBackHome} icon={Target}>job targets</NavTab>
        <NavTab active={screen === "general-learning"} onClick={() => setScreen("general-learning")} icon={BookOpen}>general learning</NavTab>
        {activeProfile && (
          <>
            <span style={{ width: 1, background: C.border, margin: "4px 4px" }} />
            <NavTab active={screen === "dashboard"} onClick={() => setScreen("dashboard")} icon={Target}>overview</NavTab>
            <NavTab active={screen === "research"} onClick={() => setScreen("research")} icon={Brain}>company intel</NavTab>
            <NavTab active={screen === "quiz"} onClick={() => setScreen("quiz")} icon={Zap}>quiz bank</NavTab>
            <NavTab active={screen === "mock"} onClick={() => setScreen("mock")} icon={MessageSquare}>mock interview</NavTab>
            <NavTab active={screen === "notes"} onClick={() => setScreen("notes")} icon={BookOpen}>role-based learning</NavTab>
          </>
        )}
      </div>
    </div>
  );
}

function NavTab({ active, onClick, children, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: C.mono,
        fontSize: 12,
        padding: "7px 12px",
        borderRadius: 4,
        border: "none",
        background: active ? C.panel2 : "transparent",
        color: active ? C.green : C.textDim,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        letterSpacing: "0.01em",
      }}
    >
      <Icon size={13} />
      {children}
    </button>
  );
}

// ============================================================
// GENERAL LEARNING MODE — static prepopulated content
// ============================================================
function GeneralLearning() {
  const [openCats, setOpenCats] = useState({ "java-jvm": true });
  const [query, setQuery] = useState("");

  function toggle(id) {
    setOpenCats((s) => ({ ...s, [id]: !s[id] }));
  }

  const q = query.trim().toLowerCase();
  const filtered = GENERAL_LEARNING.categories.map((cat) => {
    if (!q) return cat;
    const topics = cat.topics.filter(
      (t) => t.topic.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q)
    );
    return { ...cat, topics };
  }).filter((cat) => !q || cat.topics.length > 0 || cat.title.toLowerCase().includes(q));

  const totalTopics = GENERAL_LEARNING.categories.reduce((s, c) => s + c.topics.length, 0);

  return (
    <div>
      <Eyebrow color={C.blue}>general learning</Eyebrow>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Core fundamentals to advanced, ready to go</h1>
      <p style={{ color: C.textDim, fontSize: 13, marginBottom: 4, maxWidth: 600, lineHeight: 1.6 }}>
        A stable reference covering Java/JVM, Spring, Kafka, distributed systems, databases, cloud-native, security, and AI infrastructure — not tied to any specific job target, doesn't change on reload.
      </p>
      <p style={{ fontFamily: C.mono, fontSize: 11, color: C.textFaint, marginBottom: 20 }}>
        {GENERAL_LEARNING.categories.length} categories · {totalTopics} topics
      </p>

      <input
        placeholder="Search topics... (e.g. 'Kafka offset', 'CAP theorem')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ ...inputStyle, width: "100%", marginBottom: 20, fontFamily: C.mono, fontSize: 12.5 }}
      />

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map((cat) => (
          <Panel key={cat.id} style={{ padding: 0, overflow: "hidden" }}>
            <button
              onClick={() => toggle(cat.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{cat.title}</div>
                <span style={{ fontFamily: C.mono, fontSize: 10, color: C.textFaint }}>{cat.topics.length} topics</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: C.mono, fontSize: 10, color: C.blue, background: `${C.blue}15`, padding: "3px 8px", borderRadius: 3 }}>{cat.level}</span>
                {(openCats[cat.id] || q) ? <ChevronUp size={16} color={C.textFaint} /> : <ChevronDown size={16} color={C.textFaint} />}
              </div>
            </button>
            {(openCats[cat.id] || q) && (
              <div style={{ padding: "0 20px 20px" }}>
                {cat.topics.map((t, i) => (
                  <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < cat.topics.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 5, color: C.green }}>{t.topic}</div>
                    <p style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.7, margin: 0 }}>{t.notes}</p>
                  </div>
                ))}
                {cat.topics.length === 0 && <p style={{ fontSize: 12, color: C.textFaint, fontFamily: C.mono }}>no matches in this category</p>}
              </div>
            )}
          </Panel>
        ))}
        {filtered.length === 0 && (
          <Panel style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: C.textFaint, fontSize: 13 }}>No topics match "{query}"</p>
          </Panel>
        )}
      </div>
    </div>
  );
}

// ============================================================
// HOME — list / create profiles (job targets)
// ============================================================
function Home({ profiles, onSelect, onCreate, onDelete }) {
  const [showForm, setShowForm] = useState(profiles.length === 0);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!company.trim() || !jd.trim()) return;
    setCreating(true);
    const id = await onCreate({ company: company.trim(), role: role.trim() || "Role", jd: jd.trim() });
    setCreating(false);
    onSelect(id);
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Eyebrow color={C.green}>● system ready</Eyebrow>
        <h1 style={{ fontFamily: C.sans, fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
          Interview prep, run like a deployment pipeline.
        </h1>
        <p style={{ color: C.textDim, fontSize: 14, marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>
          Paste a job description. Get a researched company brief, a 100-question quiz bank, a live mock interviewer that grades your answers, and fundamentals-to-advanced notes — all tailored to your resume.
        </p>
      </div>

      {profiles.length > 0 && !showForm && (
        <div style={{ marginBottom: 36 }}>
          <Eyebrow color={C.green}>continue where you left off — {profiles.length} saved</Eyebrow>
          <div style={{ display: "grid", gap: 10 }}>
            {profiles.map((p) => (
              <div
                key={p.id}
                style={{
                  background: C.panel,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: 6,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => onSelect(p.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 6, background: `${C.green}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Target size={16} color={C.green} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{p.role} <span style={{ color: C.textFaint, fontWeight: 400 }}>@</span> <span style={{ color: C.green }}>{p.company}</span></div>
                    <div style={{ fontFamily: C.mono, fontSize: 11, color: C.textFaint, marginTop: 3 }}>
                      saved {new Date(p.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm(`Delete target "${p.role} @ ${p.company}"? This removes all saved quiz, research, mock interview and notes data for it.`)) onDelete(p.id); }}
                    style={{ background: "transparent", border: "none", color: C.textFaint, cursor: "pointer", padding: 6 }}
                  >
                    <Trash2 size={14} />
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: C.mono, fontSize: 12, color: C.green, fontWeight: 600 }}>
                    continue <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showForm && (
        <div style={{ borderTop: profiles.length > 0 ? `1px solid ${C.border}` : "none", paddingTop: profiles.length > 0 ? 24 : 0 }}>
          {profiles.length > 0 && <Eyebrow>or start something new</Eyebrow>}
          <Btn onClick={() => setShowForm(true)} icon={Plus} variant={profiles.length > 0 ? "secondary" : "primary"} style={{ marginBottom: 14 }}>
            new job target
          </Btn>
          <p style={{ fontSize: 12, color: C.textFaint, marginBottom: 0, fontFamily: C.mono }}>
            no job target yet? the <span style={{ color: C.blue }}>general learning</span> tab above has fundamentals-to-advanced notes ready now, no setup needed.
          </p>
        </div>
      )}

      {showForm && (
        <Panel style={{ marginBottom: 32 }}>
          <Eyebrow>new job target</Eyebrow>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <input
              placeholder="Company (e.g. Spotify)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Role (e.g. Lead Backend Engineer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inputStyle}
            />
          </div>
          <textarea
            placeholder="Paste the full job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            style={{ ...inputStyle, width: "100%", minHeight: 180, resize: "vertical", fontFamily: C.mono, fontSize: 12.5, lineHeight: 1.6 }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn onClick={handleCreate} disabled={!company.trim() || !jd.trim() || creating} icon={creating ? Loader2 : ChevronRight}>
              {creating ? "creating..." : "create target"}
            </Btn>
            {profiles.length > 0 && (
              <Btn variant="ghost" onClick={() => setShowForm(false)}>cancel</Btn>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}

const inputStyle = {
  background: C.panel2,
  border: `1px solid ${C.border}`,
  borderRadius: 4,
  padding: "10px 12px",
  color: C.text,
  fontSize: 13,
  fontFamily: C.sans,
  flex: 1,
};

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ profile, setScreen }) {
  const [stats, setStats] = useState({ quizDone: 0, quizTotal: 0, mockDone: 0, notesReady: false, researchReady: false });

  useEffect(() => {
    (async () => {
      const quiz = await storeGet(`quiz:${profile.id}`, { questions: [], answered: {} });
      const mock = await storeGet(`mock:${profile.id}`, { sessions: [] });
      const notes = await storeGet(`notes:${profile.id}`, null);
      const research = await storeGet(`research:${profile.id}`, null);
      setStats({
        quizDone: Object.keys(quiz.answered || {}).length,
        quizTotal: (quiz.questions || []).length,
        mockDone: (mock.sessions || []).length,
        notesReady: !!notes,
        researchReady: !!research,
      });
    })();
  }, [profile.id]);

  const cards = [
    { key: "research", icon: Brain, title: "Company Intel", desc: "How they interview, what they value, what to brush up on.", status: stats.researchReady ? "ready" : "not started", screen: "research" },
    { key: "quiz", icon: Zap, title: "Quiz Bank", desc: "100 MCQs from fundamentals to JD-specific, with explanations.", status: stats.quizTotal > 0 ? `${stats.quizDone}/${stats.quizTotal} answered` : "not started", screen: "quiz" },
    { key: "mock", icon: MessageSquare, title: "Mock Interview", desc: "Live Q&A. You answer, it grades and tells you how to improve.", status: stats.mockDone > 0 ? `${stats.mockDone} session(s)` : "not started", screen: "mock" },
    { key: "notes", icon: BookOpen, title: "Role-Based Learning", desc: "Fundamentals → advanced, your scenarios, FAQs, behavioral prep — tailored to this JD.", status: stats.notesReady ? "ready" : "not started", screen: "notes" },
  ];

  return (
    <div>
      <Eyebrow color={C.green}>● target active</Eyebrow>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{profile.role} @ {profile.company}</h1>
      <p style={{ color: C.textFaint, fontSize: 13, fontFamily: C.mono, marginBottom: 28 }}>
        created {new Date(profile.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
      </p>

      <details style={{ marginBottom: 28 }}>
        <summary style={{ cursor: "pointer", fontFamily: C.mono, fontSize: 12, color: C.textDim, marginBottom: 8 }}>view job description</summary>
        <Panel style={{ marginTop: 10, maxHeight: 240, overflowY: "auto" }}>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: C.mono, fontSize: 12, color: C.textDim, margin: 0, lineHeight: 1.6 }}>{profile.jd}</pre>
        </Panel>
      </details>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {cards.map((c) => (
          <div
            key={c.key}
            onClick={() => setScreen(c.screen)}
            style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20, cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, background: C.panel2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <c.icon size={15} color={C.green} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{c.title}</div>
            </div>
            <p style={{ color: C.textDim, fontSize: 12.5, lineHeight: 1.5, margin: "0 0 14px" }}>{c.desc}</p>
            <div style={{ fontFamily: C.mono, fontSize: 11, color: c.status.includes("not started") ? C.textFaint : C.green, display: "flex", alignItems: "center", gap: 6 }}>
              <StatusDot color={c.status.includes("not started") ? C.textFaint : C.green} />
              {c.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// QUIZ MODE
// ============================================================
function QuizMode({ profile }) {
  const [data, setData] = useState({ questions: [], answered: {} });
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [revealedId, setRevealedId] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unanswered, wrong

  useEffect(() => {
    (async () => {
      const d = await storeGet(`quiz:${profile.id}`, { questions: [], answered: {} });
      setData(d);
      setLoaded(true);
    })();
  }, [profile.id]);

  async function persist(next) {
    setData(next);
    await storeSet(`quiz:${profile.id}`, next);
  }

  async function generateBatch() {
    setGenerating(true);
    setError(null);
    try {
      const existingTopics = data.questions.slice(-15).map((q) => q.question).join(" | ");
      const batchNum = Math.floor(data.questions.length / 20) + 1;
      const system = `You are an expert technical interview question writer for backend/distributed-systems/Java roles at top financial institutions and tech companies. You generate rigorous multiple-choice questions with exactly 4 options, one correct answer, and a clear explanation of why the correct answer is right AND why each wrong option is wrong. Output ONLY valid JSON, no markdown fences, no preamble.`;
      const userMsg = `Job description:\n${profile.jd}\n\nCandidate background (for calibrating difficulty/relevance — Lead-level, 8+ years, Java/Spring Boot/Kafka/distributed systems/financial sector):\n${MASTER_RESUME.slice(0, 1200)}\n\nGenerate exactly 20 multiple-choice interview questions (batch ${batchNum}) covering a mix of: core Java/JVM internals, Spring Boot/Spring Cloud, Apache Kafka (since this is an expert-level area), distributed systems & system design, databases/SQL, cloud-native (Kubernetes/OpenShift/Docker), security (OAuth/JWT/MTLS), and anything specific to the technologies named in the JD above. Skew toward Lead/Senior-level depth — not basic syntax trivia. If the JD mentions specific tools, frameworks, or company-specific tech (e.g. a particular cloud platform, a known internal tool, a specific architecture style), use web search to verify accurate, current details about them and write questions that reflect real-world depth, not generic textbook facts.\n\nAvoid repeating these already-asked questions: ${existingTopics || "(none yet)"}\n\nReturn ONLY a JSON array of exactly 20 objects, each with this exact shape:\n{"question": "...", "options": ["A text", "B text", "C text", "D text"], "correctIndex": 0, "explanation": "Why the correct answer is right, and briefly why each of the other three is wrong.", "topic": "short topic tag like 'Kafka' or 'JVM Internals'"}\n\nReturn ONLY the JSON array, nothing else.`;

      const result = await callClaude({
        system,
        messages: [{ role: "user", content: userMsg }],
        useSearch: true,
        maxTokens: 8000,
      });
      if (result.stopReason === "max_tokens") {
        throw new Error("Response was cut off (hit token limit) before finishing. Try generating a smaller batch or try again.");
      }
      const parsed = extractJSON(result.text);
      const newQs = parsed.map((q) => ({ ...q, id: uid() }));
      const next = { questions: [...data.questions, ...newQs], answered: data.answered };
      await persist(next);
    } catch (e) {
      console.error(e);
      setError("Couldn't generate questions. Try again — " + e.message);
    }
    setGenerating(false);
  }

  function selectAnswer(qId, optionIndex) {
    const next = { ...data, answered: { ...data.answered, [qId]: optionIndex } };
    persist(next);
    setRevealedId(qId);
  }

  if (!loaded) return <LoadingLine text="loading quiz bank..." />;

  const correctCount = data.questions.filter((q) => data.answered[q.id] === q.correctIndex).length;
  const answeredCount = Object.keys(data.answered).length;

  let visibleQuestions = data.questions;
  if (filter === "unanswered") visibleQuestions = data.questions.filter((q) => data.answered[q.id] === undefined);
  if (filter === "wrong") visibleQuestions = data.questions.filter((q) => data.answered[q.id] !== undefined && data.answered[q.id] !== q.correctIndex);

  return (
    <div>
      <Eyebrow color={C.green}>quiz bank</Eyebrow>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>100-question target</h1>
      <p style={{ color: C.textDim, fontSize: 13, marginBottom: 20 }}>Generated in batches of 20, sourced from current web material plus your resume context.</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <Stat label="generated" value={`${data.questions.length}/100`} />
        <Stat label="answered" value={answeredCount} />
        <Stat label="correct" value={answeredCount ? `${correctCount}/${answeredCount}` : "—"} color={C.green} />
        <div style={{ flex: 1 }} />
        {data.questions.length < 100 && (
          <Btn onClick={generateBatch} disabled={generating} icon={generating ? Loader2 : Plus}>
            {generating ? "researching & generating..." : `generate ${Math.min(20, 100 - data.questions.length)} more`}
          </Btn>
        )}
      </div>

      {error && <div style={{ color: C.red, fontSize: 13, fontFamily: C.mono, marginBottom: 16 }}>{error}</div>}

      {data.questions.length === 0 && !generating && (
        <Panel style={{ textAlign: "center", padding: 50 }}>
          <p style={{ color: C.textDim, fontSize: 14, marginBottom: 16 }}>No questions yet. Generate your first batch of 20 — Claude will search the web for current, JD-relevant material.</p>
          <Btn onClick={generateBatch} icon={Plus}>generate first batch</Btn>
        </Panel>
      )}

      {generating && data.questions.length === 0 && (
        <Panel style={{ textAlign: "center", padding: 50 }}>
          <LoadingLine text="searching the web and writing 20 questions tailored to this JD..." />
        </Panel>
      )}

      {data.questions.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            <FilterTab active={filter === "all"} onClick={() => setFilter("all")}>all ({data.questions.length})</FilterTab>
            <FilterTab active={filter === "unanswered"} onClick={() => setFilter("unanswered")}>unanswered ({data.questions.length - answeredCount})</FilterTab>
            <FilterTab active={filter === "wrong"} onClick={() => setFilter("wrong")}>missed ({answeredCount - correctCount})</FilterTab>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {visibleQuestions.map((q, idx) => (
              <QuizCard
                key={q.id}
                q={q}
                index={data.questions.indexOf(q) + 1}
                selected={data.answered[q.id]}
                onSelect={(i) => selectAnswer(q.id, i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, color = C.text }) {
  return (
    <div>
      <div style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontFamily: C.mono, fontSize: 10, color: C.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );
}

function FilterTab({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: C.mono, fontSize: 11.5, padding: "6px 12px", borderRadius: 4,
      border: `1px solid ${active ? C.green : C.border}`, background: active ? `${C.green}11` : "transparent",
      color: active ? C.green : C.textDim, cursor: "pointer",
    }}>{children}</button>
  );
}

function QuizCard({ q, index, selected, onSelect }) {
  const answered = selected !== undefined;
  const isCorrect = selected === q.correctIndex;
  return (
    <Panel style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
          <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textFaint }}>Q{index}</span>
          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>{q.question}</span>
        </div>
        {q.topic && <span style={{ fontFamily: C.mono, fontSize: 10, color: C.blue, background: `${C.blue}15`, padding: "3px 8px", borderRadius: 3, whiteSpace: "nowrap", marginLeft: 10 }}>{q.topic}</span>}
      </div>
      <div style={{ display: "grid", gap: 7 }}>
        {q.options.map((opt, i) => {
          let bg = C.panel2, border = C.border, color = C.text;
          if (answered) {
            if (i === q.correctIndex) { bg = `${C.green}14`; border = C.green; color = C.green; }
            else if (i === selected) { bg = `${C.red}14`; border = C.red; color = C.red; }
          }
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => onSelect(i)}
              style={{
                textAlign: "left", padding: "10px 12px", borderRadius: 4, border: `1px solid ${border}`,
                background: bg, color, fontSize: 13, cursor: answered ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 10, fontFamily: C.sans,
              }}
            >
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textFaint, minWidth: 14 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{opt}</span>
              {answered && i === q.correctIndex && <Check size={14} color={C.green} />}
              {answered && i === selected && i !== q.correctIndex && <X size={14} color={C.red} />}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ marginTop: 12, padding: "12px 14px", background: C.panel2, borderRadius: 4, borderLeft: `2px solid ${isCorrect ? C.green : C.amber}` }}>
          <div style={{ fontFamily: C.mono, fontSize: 10.5, color: isCorrect ? C.green : C.amber, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {isCorrect ? "correct" : "review"}
          </div>
          <p style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.6, margin: 0 }}>{q.explanation}</p>
        </div>
      )}
    </Panel>
  );
}

// ============================================================
// RESEARCH MODE — company intel
// ============================================================
function ResearchMode({ profile }) {
  const [research, setResearch] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await storeGet(`research:${profile.id}`, null);
      setResearch(r);
      setLoaded(true);
    })();
  }, [profile.id]);

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const system = `You are a sharp technical recruiter and interview coach who deeply researches companies before prepping a candidate. Output ONLY valid JSON, no markdown fences, no preamble.`;
      const userMsg = `Company: ${profile.company}\nRole: ${profile.role}\nJob description:\n${profile.jd}\n\nCandidate resume summary:\n${MASTER_RESUME.slice(0, 1500)}\n\nUse web search to research how this company actually interviews for backend/engineering roles like this (Glassdoor, Blind, LeetCode discuss, levels.fyi, engineering blog posts, etc. — search for "${profile.company} interview process engineer", "${profile.company} engineering blog", "${profile.company} interview questions backend", and similar). Find real signal: their interview stages, what they probe for, their tech stack and engineering culture, and what this specific role is really asking for versus the JD's generic boilerplate.\n\nReturn ONLY a JSON object with this exact shape:\n{\n  "companyOverview": "2-3 sentences on what the company does and engineering culture relevant to this role",\n  "interviewProcess": [{"stage": "e.g. Recruiter screen", "what": "what happens / what they assess", "duration": "e.g. 30 min"}],\n  "whatTheyValue": ["bullet points on what this company's engineers/interviewers specifically value, based on research"],\n  "techStackSignals": ["specific technologies/practices this company is known for using, from research"],\n  "likelyQuestionThemes": ["specific question themes/types this company is known to ask, based on research, not generic guesses"],\n  "gapsToAddress": ["honest gaps between the candidate's resume and what this role/company wants, specific and actionable"],\n  "candidateStrengthsToLeanOn": ["specific resume strengths that map directly to what this company wants — reference actual resume content"],\n  "sourcesUsed": ["short description of source types found, e.g. 'Glassdoor reviews', 'engineering blog post on X'"]\n}\n\nBe specific and honest — if you can't find strong signal on the interview process for this exact company, say so in companyOverview and lean on general practices for similar companies/roles instead of inventing fake specifics. Return ONLY the JSON object.`;

      const result = await callClaude({
        system,
        messages: [{ role: "user", content: userMsg }],
        useSearch: true,
        maxTokens: 8000,
      });
      if (result.stopReason === "max_tokens") {
        throw new Error("Response was cut off before finishing. Try again.");
      }
      const parsed = extractJSON(result.text);
      await storeSet(`research:${profile.id}`, parsed);
      setResearch(parsed);
    } catch (e) {
      console.error(e);
      setError("Research failed — " + e.message);
    }
    setGenerating(false);
  }

  if (!loaded) return <LoadingLine text="loading..." />;

  return (
    <div>
      <Eyebrow color={C.green}>company intel</Eyebrow>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>How {profile.company} actually interviews</h1>
      <p style={{ color: C.textDim, fontSize: 13, marginBottom: 24 }}>Researched from the live web — interview process, culture signals, and gaps to close before you walk in.</p>

      {!research && !generating && (
        <Panel style={{ textAlign: "center", padding: 50 }}>
          <p style={{ color: C.textDim, fontSize: 14, marginBottom: 16 }}>No research yet for {profile.company}.</p>
          <Btn onClick={generate} icon={Brain}>research {profile.company}</Btn>
        </Panel>
      )}

      {generating && (
        <Panel style={{ textAlign: "center", padding: 50 }}>
          <LoadingLine text={`searching the web for ${profile.company}'s interview process, culture, and tech signals...`} />
        </Panel>
      )}

      {error && <div style={{ color: C.red, fontSize: 13, fontFamily: C.mono, marginBottom: 16 }}>{error}</div>}

      {research && !generating && (
        <div style={{ display: "grid", gap: 16 }}>
          <Panel>
            <Eyebrow>overview</Eyebrow>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, margin: 0 }}>{research.companyOverview}</p>
          </Panel>

          {research.interviewProcess && research.interviewProcess.length > 0 && (
            <Panel>
              <Eyebrow>interview process</Eyebrow>
              <div style={{ display: "grid", gap: 0 }}>
                {research.interviewProcess.map((stage, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < research.interviewProcess.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontFamily: C.mono, fontSize: 11, color: C.green, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{stage.stage}</div>
                      <div style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.5 }}>{stage.what}</div>
                    </div>
                    {stage.duration && <div style={{ fontFamily: C.mono, fontSize: 11, color: C.textFaint, whiteSpace: "nowrap" }}>{stage.duration}</div>}
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ListPanel title="what they value" items={research.whatTheyValue} color={C.green} />
            <ListPanel title="tech stack signals" items={research.techStackSignals} color={C.blue} />
            <ListPanel title="likely question themes" items={research.likelyQuestionThemes} color={C.blue} />
            <ListPanel title="gaps to address" items={research.gapsToAddress} color={C.amber} />
          </div>

          <Panel>
            <Eyebrow color={C.green}>your strengths to lean on</Eyebrow>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {(research.candidateStrengthsToLeanOn || []).map((s, i) => (
                <li key={i} style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{s}</li>
              ))}
            </ul>
          </Panel>

          <Btn variant="secondary" onClick={generate} icon={RotateCcw} disabled={generating}>re-research</Btn>
        </div>
      )}
    </div>
  );
}

function ListPanel({ title, items, color }) {
  if (!items || items.length === 0) return null;
  return (
    <Panel>
      <Eyebrow color={color}>{title}</Eyebrow>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.65, marginBottom: 4 }}>{it}</li>
        ))}
      </ul>
    </Panel>
  );
}

// ============================================================
// MOCK INTERVIEW MODE
// ============================================================
function MockInterviewMode({ profile }) {
  const [phase, setPhase] = useState("setup"); // setup, active, summary
  const [turns, setTurns] = useState([]); // {role: 'interviewer'|'candidate', text, grade?}
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      const m = await storeGet(`mock:${profile.id}`, { sessions: [] });
      setSessions(m.sessions || []);
    })();
  }, [profile.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [turns, busy]);

  function buildHistoryForApi(allTurns) {
    return allTurns.map((t) => ({
      role: t.role === "interviewer" ? "assistant" : "user",
      content: t.text,
    }));
  }

  const interviewerSystem = `You are conducting a live mock job interview for the role of "${profile.role}" at "${profile.company}". You are the interviewer.

Job description:
${profile.jd}

Candidate resume:
${MASTER_RESUME}

Rules:
- Ask one question at a time, in a natural interviewer voice. Mix technical depth questions (tied to the JD and resume — Kafka, Spring Boot, distributed systems, system design, incident response) with at least 1-2 behavioral questions (e.g. "tell me about yourself", "tell me about a conflict", "a time you led under pressure").
- Reference the candidate's actual resume content when relevant (e.g. ask them to go deeper on the 500K+ daily Kafka events work, the OCP migration, the incident response story) — make it feel like a real interviewer who read their resume.
- After the candidate answers, do NOT immediately ask the next question. Instead respond with a JSON grading block (see format below), then on a new line write "---NEXT---" and then ask the next question conversationally.
- Keep your spoken interviewer questions concise and natural, like a real person talking, not a wall of text.
- Vary difficulty — include at least one system design question and one debugging/incident scenario question across the session.

When grading a candidate's answer, respond in this exact format:
GRADE_JSON: {"score": <1-10>, "strengths": "...", "missing": "...", "modelAnswer": "a strong example answer, 2-4 sentences, referencing their actual background where appropriate"}
---NEXT---
<your next question, conversationally>

For the very first message (no candidate answer yet to grade), skip the GRADE_JSON and ---NEXT--- markers entirely and just greet the candidate briefly and ask your first question (start with "Tell me about yourself" or similar opener).`;

  async function startInterview() {
    setBusy(true);
    setError(null);
    setPhase("active");
    try {
      const result = await callClaude({
        system: interviewerSystem,
        messages: [{ role: "user", content: "Begin the interview." }],
        maxTokens: 600,
      });
      setTurns([{ role: "interviewer", text: result.text.trim() }]);
      setQuestionCount(1);
    } catch (e) {
      setError("Couldn't start interview — " + e.message);
      setPhase("setup");
    }
    setBusy(false);
  }

  async function sendAnswer() {
    if (!input.trim() || busy) return;
    const candidateTurn = { role: "candidate", text: input.trim() };
    const newTurns = [...turns, candidateTurn];
    setTurns(newTurns);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const apiMessages = [
        ...buildHistoryForApi(turns),
        { role: "user", content: input.trim() },
      ];
      const result = await callClaude({
        system: interviewerSystem,
        messages: apiMessages,
        maxTokens: 800,
      });
      const text = result.text;

      // parse grade + next question
      let grade = null, nextQuestion = text;
      const gradeMatch = text.match(/GRADE_JSON:\s*(\{[\s\S]*?\})\s*---NEXT---/);
      if (gradeMatch) {
        try {
          grade = JSON.parse(gradeMatch[1]);
        } catch (e) {
          grade = null;
        }
        nextQuestion = text.split("---NEXT---")[1] || "";
      }

      const updatedTurns = [...newTurns];
      if (grade) {
        updatedTurns[updatedTurns.length - 1] = { ...candidateTurn, grade };
      }
      updatedTurns.push({ role: "interviewer", text: nextQuestion.trim() });
      setTurns(updatedTurns);
      setQuestionCount((c) => c + 1);
    } catch (e) {
      setError("Something went wrong — " + e.message);
    }
    setBusy(false);
  }

  async function endInterview() {
    const graded = turns.filter((t) => t.role === "candidate" && t.grade);
    const avgScore = graded.length ? (graded.reduce((s, t) => s + (t.grade.score || 0), 0) / graded.length).toFixed(1) : null;
    const session = {
      id: uid(),
      date: Date.now(),
      questionCount: graded.length,
      avgScore,
      turns,
    };
    const next = { sessions: [session, ...sessions] };
    setSessions(next.sessions);
    await storeSet(`mock:${profile.id}`, next);
    setPhase("summary");
  }

  function newSession() {
    setTurns([]);
    setQuestionCount(0);
    setPhase("setup");
  }

  if (phase === "setup") {
    return (
      <div>
        <Eyebrow color={C.green}>mock interview</Eyebrow>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Live interview simulation</h1>
        <p style={{ color: C.textDim, fontSize: 13, marginBottom: 24, maxWidth: 600, lineHeight: 1.6 }}>
          The system plays interviewer for {profile.role} @ {profile.company}, asking questions based on the JD and your resume. You answer in the chat box. Each answer gets scored 1-10 with strengths, gaps, and a model answer.
        </p>

        {error && <div style={{ color: C.red, fontSize: 13, fontFamily: C.mono, marginBottom: 16 }}>{error}</div>}

        <Panel style={{ textAlign: "center", padding: 40, marginBottom: 24 }}>
          <Btn onClick={startInterview} disabled={busy} icon={busy ? Loader2 : Mic} style={{ margin: "0 auto" }}>
            {busy ? "starting..." : "start mock interview"}
          </Btn>
        </Panel>

        {sessions.length > 0 && (
          <div>
            <Eyebrow>past sessions</Eyebrow>
            <div style={{ display: "grid", gap: 8 }}>
              {sessions.map((s) => (
                <div key={s.id} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: C.mono, fontSize: 12, color: C.textDim }}>
                    {new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {s.questionCount} questions graded
                  </div>
                  {s.avgScore && (
                    <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: s.avgScore >= 7 ? C.green : s.avgScore >= 5 ? C.amber : C.red }}>
                      avg {s.avgScore}/10
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (phase === "summary") {
    const graded = turns.filter((t) => t.role === "candidate" && t.grade);
    const avgScore = graded.length ? (graded.reduce((s, t) => s + (t.grade.score || 0), 0) / graded.length).toFixed(1) : "—";
    return (
      <div>
        <Eyebrow color={C.green}>session complete</Eyebrow>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Mock interview summary</h1>
        <div style={{ display: "flex", gap: 24, marginBottom: 28 }}>
          <Stat label="questions" value={graded.length} />
          <Stat label="avg score" value={`${avgScore}/10`} color={avgScore >= 7 ? C.green : avgScore >= 5 ? C.amber : C.red} />
        </div>
        <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
          {graded.map((t, i) => (
            <Panel key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textFaint }}>answer {i + 1}</span>
                <span style={{ fontFamily: C.mono, fontWeight: 700, fontSize: 13, color: t.grade.score >= 7 ? C.green : t.grade.score >= 5 ? C.amber : C.red }}>{t.grade.score}/10</span>
              </div>
              <p style={{ fontSize: 12.5, color: C.textFaint, marginBottom: 10, fontStyle: "italic" }}>"{t.text.slice(0, 140)}{t.text.length > 140 ? "..." : ""}"</p>
              <div style={{ fontSize: 12.5, color: C.green, marginBottom: 4 }}><b>Strengths:</b> <span style={{ color: C.textDim }}>{t.grade.strengths}</span></div>
              <div style={{ fontSize: 12.5, color: C.amber, marginBottom: 4 }}><b>Missing:</b> <span style={{ color: C.textDim }}>{t.grade.missing}</span></div>
              <div style={{ fontSize: 12.5, color: C.blue }}><b>Model answer:</b> <span style={{ color: C.textDim }}>{t.grade.modelAnswer}</span></div>
            </Panel>
          ))}
        </div>
        <Btn onClick={newSession} icon={RotateCcw}>start new session</Btn>
      </div>
    );
  }

  // active phase
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <Eyebrow color={C.green}>● live</Eyebrow>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Mock interview in progress</h1>
        </div>
        <Btn variant="secondary" onClick={endInterview} disabled={busy}>end & review</Btn>
      </div>

      <div ref={scrollRef} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20, height: 440, overflowY: "auto", marginBottom: 14, display: "flex", flexDirection: "column", gap: 14 }}>
        {turns.map((t, i) => (
          <ChatTurn key={i} turn={t} />
        ))}
        {busy && <LoadingLine text="interviewer is thinking..." />}
      </div>

      {error && <div style={{ color: C.red, fontSize: 12, fontFamily: C.mono, marginBottom: 10 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
          placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
          disabled={busy}
          style={{ ...inputStyle, flex: 1, minHeight: 60, resize: "vertical", fontSize: 13.5, lineHeight: 1.6 }}
        />
        <Btn onClick={sendAnswer} disabled={busy || !input.trim()} icon={Send} style={{ alignSelf: "flex-end" }}>send</Btn>
      </div>
    </div>
  );
}

function ChatTurn({ turn }) {
  if (turn.role === "interviewer") {
    return (
      <div style={{ display: "flex", gap: 10, maxWidth: "85%" }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: C.panel2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <MessageSquare size={13} color={C.blue} />
        </div>
        <div style={{ background: C.panel2, padding: "10px 14px", borderRadius: 6, fontSize: 13.5, lineHeight: 1.6 }}>{turn.text}</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <div style={{ maxWidth: "85%", background: `${C.green}14`, border: `1px solid ${C.green}33`, padding: "10px 14px", borderRadius: 6, fontSize: 13.5, lineHeight: 1.6, alignSelf: "flex-end" }}>{turn.text}</div>
      {turn.grade && (
        <div style={{ maxWidth: "85%", background: C.panel2, borderRadius: 6, padding: "12px 14px", fontSize: 12.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Award size={13} color={turn.grade.score >= 7 ? C.green : turn.grade.score >= 5 ? C.amber : C.red} />
            <span style={{ fontFamily: C.mono, fontWeight: 700, color: turn.grade.score >= 7 ? C.green : turn.grade.score >= 5 ? C.amber : C.red }}>{turn.grade.score}/10</span>
          </div>
          <div style={{ color: C.textDim, marginBottom: 4 }}><b style={{ color: C.green }}>Strengths:</b> {turn.grade.strengths}</div>
          <div style={{ color: C.textDim, marginBottom: 4 }}><b style={{ color: C.amber }}>Missing:</b> {turn.grade.missing}</div>
          <div style={{ color: C.textDim }}><b style={{ color: C.blue }}>Model answer:</b> {turn.grade.modelAnswer}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// NOTES MODE — learning notes, scenarios, FAQs, behavioral
// ============================================================
function NotesMode({ profile }) {
  const [notes, setNotes] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    (async () => {
      const n = await storeGet(`notes:${profile.id}`, null);
      setNotes(n);
      setLoaded(true);
    })();
  }, [profile.id]);

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const system = `You are an expert technical interview coach building exhaustive prep notes for a Lead-level backend engineer. Output ONLY valid JSON, no markdown fences, no preamble.`;
      const userMsg = `Job description:\n${profile.jd}\n\nCandidate resume:\n${MASTER_RESUME}\n\nUse web search where helpful to verify current best practices, terminology, and commonly asked interview content for the technologies in this JD (Java, Spring Boot, Kafka, distributed systems, cloud-native, etc).\n\nBuild comprehensive interview prep notes. Return ONLY a JSON object with this exact shape:\n{\n  "fundamentals": [{"topic": "e.g. JVM Memory Model", "notes": "concise but substantive explanation, 3-6 sentences, fundamentals level"}],\n  "advanced": [{"topic": "e.g. Kafka Exactly-Once Semantics", "notes": "concise but substantive explanation, 3-6 sentences, advanced/lead level, tied to JD"}],\n  "resumeScenarios": [{"scenario": "short title referencing actual resume content, e.g. 'The OCP 3.x to 4.x zero-downtime migration'", "talkingPoints": "how to explain this in an interview: situation, action, result, in 3-5 sentences, first person, ready to speak", "likelyFollowUps": ["follow-up question an interviewer might ask about this"]}],\n  "faqs": [{"question": "frequently asked technical interview question relevant to this JD", "answer": "strong concise answer"}],\n  "behavioral": [{"question": "behavioral question like 'Tell me about yourself' or 'Tell me about a conflict with a teammate'", "guidance": "how to structure the answer (e.g. STAR)", "draftAnswer": "a draft answer in first person using the candidate's actual resume details where relevant"}]\n}\n\nRequirements:\n- fundamentals: 8-10 items covering core CS/Java/Spring/DB basics relevant to this JD\n- advanced: 8-10 items covering Lead-level depth topics relevant to this JD (Kafka internals, distributed systems tradeoffs, system design, scaling, security, etc)\n- resumeScenarios: 6-8 items, each must reference SPECIFIC real content from the resume (the 500K events, the OCP migration, the NAS ingestion re-architecture, the incident response, the Avro schemas, etc) so the candidate can actually speak to their real work\n- faqs: 10-12 commonly asked questions for this type of role\n- behavioral: 8 questions including 'Tell me about yourself', conflict, leadership, failure, why this company, strength/weakness, time under pressure, disagreement with manager — each with a draft answer using real resume details\n\nReturn ONLY the JSON object.`;

      const result = await callClaude({
        system,
        messages: [{ role: "user", content: userMsg }],
        useSearch: true,
        maxTokens: 12000,
      });
      if (result.stopReason === "max_tokens") {
        throw new Error("Response was cut off before finishing (notes are long). Try again — it occasionally needs a retry.");
      }
      const parsed = extractJSON(result.text);
      await storeSet(`notes:${profile.id}`, parsed);
      setNotes(parsed);
    } catch (e) {
      console.error(e);
      setError("Couldn't generate notes — " + e.message);
    }
    setGenerating(false);
  }

  function toggle(key) {
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  }

  if (!loaded) return <LoadingLine text="loading..." />;

  return (
    <div>
      <Eyebrow color={C.green}>learning notes</Eyebrow>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Fundamentals to advanced, tied to your resume</h1>
      <p style={{ color: C.textDim, fontSize: 13, marginBottom: 24 }}>Includes resume-based scenarios you can speak to, FAQs, and behavioral question drafts.</p>

      {!notes && !generating && (
        <Panel style={{ textAlign: "center", padding: 50 }}>
          <p style={{ color: C.textDim, fontSize: 14, marginBottom: 16 }}>No notes generated yet.</p>
          <Btn onClick={generate} icon={BookOpen}>generate learning notes</Btn>
        </Panel>
      )}

      {generating && (
        <Panel style={{ textAlign: "center", padding: 50 }}>
          <LoadingLine text="researching and writing fundamentals → advanced notes, resume scenarios, FAQs, and behavioral drafts..." />
        </Panel>
      )}

      {error && <div style={{ color: C.red, fontSize: 13, fontFamily: C.mono, marginBottom: 16 }}>{error}</div>}

      {notes && !generating && (
        <div style={{ display: "grid", gap: 12 }}>
          <NotesSection
            id="fundamentals" title="Fundamentals" color={C.blue} icon={BookOpen}
            open={openSections.fundamentals} onToggle={() => toggle("fundamentals")}
          >
            {notes.fundamentals?.map((f, i) => <TopicNote key={i} topic={f.topic} notes={f.notes} />)}
          </NotesSection>

          <NotesSection
            id="advanced" title="Advanced / Lead-Level" color={C.green} icon={TrendingUp}
            open={openSections.advanced} onToggle={() => toggle("advanced")}
          >
            {notes.advanced?.map((f, i) => <TopicNote key={i} topic={f.topic} notes={f.notes} />)}
          </NotesSection>

          <NotesSection
            id="scenarios" title="Your Resume Scenarios" color={C.amber} icon={Target}
            open={openSections.scenarios} onToggle={() => toggle("scenarios")}
          >
            {notes.resumeScenarios?.map((s, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < notes.resumeScenarios.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 6, color: C.amber }}>{s.scenario}</div>
                <p style={{ fontSize: 12.5, color: C.text, lineHeight: 1.65, margin: "0 0 8px" }}>{s.talkingPoints}</p>
                {s.likelyFollowUps && s.likelyFollowUps.length > 0 && (
                  <div style={{ fontSize: 11.5, color: C.textFaint }}>
                    <span style={{ fontFamily: C.mono }}>likely follow-ups: </span>
                    {s.likelyFollowUps.join(" · ")}
                  </div>
                )}
              </div>
            ))}
          </NotesSection>

          <NotesSection
            id="faqs" title="Frequently Asked Questions" color={C.blue} icon={AlertCircle}
            open={openSections.faqs} onToggle={() => toggle("faqs")}
          >
            {notes.faqs?.map((f, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{f.question}</div>
                <p style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.6, margin: 0 }}>{f.answer}</p>
              </div>
            ))}
          </NotesSection>

          <NotesSection
            id="behavioral" title="Behavioral Prep" color={C.green} icon={MessageSquare}
            open={openSections.behavioral} onToggle={() => toggle("behavioral")}
          >
            {notes.behavioral?.map((b, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < notes.behavioral.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{b.question}</div>
                <div style={{ fontSize: 11, color: C.textFaint, fontFamily: C.mono, marginBottom: 8 }}>{b.guidance}</div>
                <p style={{ fontSize: 12.5, color: C.text, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>"{b.draftAnswer}"</p>
              </div>
            ))}
          </NotesSection>

          <Btn variant="secondary" onClick={generate} icon={RotateCcw} disabled={generating}>regenerate</Btn>
        </div>
      )}
    </div>
  );
}

function NotesSection({ title, color, icon: Icon, open, onToggle, children }) {
  return (
    <Panel style={{ padding: 0, overflow: "hidden" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon size={15} color={color} />
          <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{title}</span>
        </div>
        {open ? <ChevronUp size={16} color={C.textFaint} /> : <ChevronDown size={16} color={C.textFaint} />}
      </button>
      {open && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
    </Panel>
  );
}

function TopicNote({ topic, notes }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{topic}</div>
      <p style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.65, margin: 0 }}>{notes}</p>
    </div>
  );
}
