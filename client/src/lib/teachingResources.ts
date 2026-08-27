export type TeachingResourceTier = 1 | 2 | 3 | 4 | 5;

export type TeachingResource = {
  id: string;
  subject: "العربية" | "الرياضيات";
  title: string;
  description: string;
  url: string;
  tier: TeachingResourceTier;
  authority: string;
  curriculumRelationship: "غير متحقق" | "مرجع أكاديمي عام";
  freshness: "تاريخ المراجعة غير متاح";
  verification: "مرجع خارجي — مراجعة المعلم مطلوبة";
};

export const TEACHING_RESOURCES: TeachingResource[] = [
  {
    id: "illinois-arabic-resources",
    subject: "العربية",
    title: "موارد العربية — قسم اللسانيات بجامعة إلينوي",
    description: "دليل روابط للتعلم والقواعد والقواميس والمواد العربية.",
    url: "https://linguistics.illinois.edu/languages/arabic/student-resources/arabic-online-resources",
    tier: 2,
    authority: "جامعة وقسم أكاديمي",
    curriculumRelationship: "مرجع أكاديمي عام",
    freshness: "تاريخ المراجعة غير متاح",
    verification: "مرجع خارجي — مراجعة المعلم مطلوبة",
  },
  {
    id: "nsf-mathematics-resources",
    subject: "الرياضيات",
    title: "موارد الرياضيات التعليمية — NSF",
    description: "دليل دروس وأنشطة وموارد رياضيات للمعلمين والطلاب.",
    url: "https://www.nsf.gov/focus-areas/mathematics/educational-resources",
    tier: 2,
    authority: "مؤسسة علمية وطنية",
    curriculumRelationship: "مرجع أكاديمي عام",
    freshness: "تاريخ المراجعة غير متاح",
    verification: "مرجع خارجي — مراجعة المعلم مطلوبة",
  },
];

export function resourcesForSubject(subject: string): TeachingResource[] {
  return TEACHING_RESOURCES.filter((resource) => resource.subject === subject || subject.includes(resource.subject));
}

export function sourceTierLabel(tier: TeachingResourceTier): string {
  return `المستوى ${tier} — ${tier === 1 ? "مصدر رسمي" : tier === 2 ? "جامعة أو مؤسسة أكاديمية" : tier === 3 ? "مرجع متخصص" : tier === 4 ? "مصدر عام" : "غير متحقق"}`;
}
