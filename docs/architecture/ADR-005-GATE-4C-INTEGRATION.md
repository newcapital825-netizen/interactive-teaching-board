# ADR-005 — Gate 4C Arabic + Mathematics Integration

## Status

Accepted for Gate 4C Owner Review only. This ADR does not authorize Gate 4D or any engine expansion.

## Context

The project contains two controlled teaching slices: Arabic I3rab and Mathematics Step-by-Step. The architectural requirement is that both demonstrate composition over the same canonical Educational Object infrastructure while preserving subject-specific lenses, objects, validation rules, and feedback wording.

## Decision

Keep one shared `EducationalObject` contract, one Registry, one Factory boundary, one Capabilities system, one lesson Migration boundary, shared Adapters and Transformations, shared Assessment and Feedback contracts, shared Provenance and Events, and shared Persistence. Subject-specific code may define bounded object payloads, lenses, validation rules, diagnostic vocabulary, and pedagogical workflows, but it must not create a second core model or engine.

Arabic remains limited to the approved I3rab Golden Dataset. Mathematics remains limited to the approved step-by-step slice for `2x + 3 = 11`, its explicit alternative path, and its explicit unsupported boundaries. The integration layer composes both subjects in one `LessonState` and verifies source identity isolation during assessment and round-trip restoration.

## Evidence

The cross-subject integration tests create both canonical sources, resolve both through the existing Registry, assert shared schema/capability boundaries, create both lenses, assess both activities, serialize one lesson containing both subjects, restore it, and confirm separate provenance. Teacher override events remain separate from system assessment events for both subjects.

## Consequences

This decision preserves subject-agnostic Core Board behavior and makes integration auditable. It also intentionally limits generalization: the current evidence cannot support claims about full Arabic NLP, full symbolic mathematics, cloud synchronization, identity permissions, or real browser/device performance.

## Rejected Alternatives

A second Arabic or Mathematics engine, a second Registry, a subject-specific Persistence layer, or a hidden fallback object was rejected because it would violate canonical architecture and make provenance and migration non-uniform. Expanding either Golden Dataset during this integration gate was also rejected because this gate validates composition rather than subject coverage expansion.

## Verification Labels

| Concern | Status |
|---|---|
| Canonical composition | PROVEN |
| Subject identity separation | PROVEN |
| Shared local persistence | PROVEN |
| Full educational generalization | NOT PROVEN |
| Real browser/device behavior | NOT VERIFIED |
| Cloud/identity features | BLOCKED BY SCOPE |

## References

[1]: https://github.com/newcapital825-netizen/interactive-teaching-board/tree/feature/gate-4c-final-integration "Gate 4C final integration branch"

[2]: https://github.com/newcapital825-netizen/interactive-teaching-board/blob/feature/gate-4c-final-integration/tests/gate4c-final-integration.test.ts "Cross-subject integration tests"
