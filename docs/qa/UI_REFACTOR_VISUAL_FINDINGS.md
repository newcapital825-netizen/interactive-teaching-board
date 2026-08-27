# UI Refactor Visual Findings

- Desktop preview at 1280×720 shows the board as the main hero surface with lighter setup controls, floating canvas toolbar, floating contextual pill, and calmer Arabic typography.
- Mobile preview at 390×844 shows the RTL shell stacking correctly; the top action row wraps and the setup sections remain reachable.
- Playwright after the first refactor found two hit-testing regressions: desktop Journey O was blocked by the floating object inspector covering a canvas object; mobile Journey D was blocked while clicking the save button in the mobile header action row.
- The inspector was changed from an absolute overlay to a relative sheet below the canvas. The desktop Journey O issue is resolved; the mobile save-button issue remains under investigation.
- No backend, domain model, registry, capability system, or test source files were changed.


المعاينات النهائية بعد الإصلاح أظهرت أن رأس الصفحة على الهاتف يستخدم شبكة من عمودين دون قص، وأن زر «حفظ الدرس» بقي داخل viewport. لقطة سطح المكتب تُظهر هوية «مِداد · ورشة المخطوط الحي»، مساحة العمل الرئيسية، والأدوات الهادئة في أعلى shell. انتهت Playwright بـ36 اختبارًا ناجحًا على Chromium وmobile-chromium.
