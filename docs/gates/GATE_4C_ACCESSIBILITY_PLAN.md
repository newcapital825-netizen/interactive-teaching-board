# Gate 4C Accessibility Plan

## Baseline

Gate 4B يملك static/visual evidence لـRTL، semantic buttons/tabs، labels، ARIA، focus-visible، keyboard save/Escape، وresponsive form. الحالة لا تزال **PARTIALLY PROVEN**، وFull WCAG Audit = **NOT VERIFIED**.

## Requirements

| المجال | خطة التحقق | معيار القبول |
| --- | --- | --- |
| RTL | ترتيب بصري ومنطقي عربي، mixed LTR numbers/equations | لا انعكاس للمعنى أو focus order |
| Keyboard | tab order، activation، Escape، shortcuts | كل الوظائف الأساسية غير canvas قابلة للوصول |
| Screen reader | role/name/state/value/live feedback | labels وannouncements مفهومة |
| Focus | visible focus، no trap، restore after modal | contrast واضح |
| Contrast | text/control/focus states | automated contrast + manual review |
| Reduced motion | respect user preference | no essential information in motion |
| Canvas alternative | object list/inspector/action buttons | لا تعتمد الوظيفة التعليمية على pointer وحده |
| Responsive | 375px، 768px، 1280px | لا clipping أو overflow للمسار الأساسي |

## Gate 4C test cases

سيُختبر source selection، lens opening، activity answer، assessment submission، feedback reading، teacher review، save/restore، presentation entry/exit، والتعامل مع error state عبر keyboard أولًا. عند توفر AT تُضاف NVDA/VoiceOver أو equivalent review، وتُسجل النتائج كأدلة لا كافتراضات.

## Non-claims

لا تعتبر screenshot دليلًا على screen-reader support، ولا يعتبر وجود `aria-label` تدقيق WCAG كاملًا. لا تعتبر responsive viewport دليل touch أو stylus.

## References

1. [Gate 4C Discovery](./GATE_4C_DISCOVERY.md)
2. [Gate 4B Final Hardening](./GATE_4B_FINAL_HARDENING.md)
3. [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
