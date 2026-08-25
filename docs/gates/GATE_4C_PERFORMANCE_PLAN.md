# Gate 4C Performance Plan

## Measurement boundary

Node benchmark يقيس domain operations فقط. لا يحل محل browser benchmark أو real-device benchmark. كل تقرير لاحق يذكر البيئة منفصلة ولا يرفع قياس sandbox إلى SLA.

## Levels

| البيئة | الأحجام | القياسات |
| --- | --- | --- |
| Node/domain | 100،250،500،1000،2500 objects | create، serialize، restore، duplicate، group، lens regeneration |
| Browser | 100،250،500 objects | initial load، interaction latency، selection، drag، resize، zoom، save، restore |
| Real device | representative lesson sizes | touch selection، pinch، drag، resize، stylus، palm rejection عند الحاجة |

## Budgets to establish

لا تُثبت أرقام نهائية قبل وجود baseline في browser. يجب تسجيل p50/p95، memory، bundle size، long tasks، and error rate. أي regression في Core أو provenance أو responsiveness يوقف expansion ولو نجحت unit tests.

## Current known evidence

Gate 4B يثبت Node measurements عند 100/250/500 objects، ويثبت نجاح production build مع تحذير chunk أكبر من 500 kB. لا يوجد browser runner أو hardware evidence؛ لذلك Browser وReal Device status = NOT VERIFIED.

## Optimization order

يبدأ القياس من correctness ثم interaction latency ثم render cost ثم persistence. لا تُضاف dynamic loading أو renderer dependency لمجرد خفض رقم دون قرار معماري وlicense review. يبقى autoscale/static hosting مناسبًا للـprototype ما دامت workloads محلية ولا توجد background services.

## References

1. [Gate 4C Discovery](./GATE_4C_DISCOVERY.md)
2. [Gate 4B Final Hardening](./GATE_4B_FINAL_HARDENING.md)
