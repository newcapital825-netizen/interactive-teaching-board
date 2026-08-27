export type TeachingResource = {
  id: string;
  subject: "العربية" | "الرياضيات";
  title: string;
  description: string;
  url: string;
  verification: "مرجع خارجي — مراجعة المعلم مطلوبة";
};

export const TEACHING_RESOURCES: TeachingResource[] = [
  {
    id: "illinois-arabic-resources",
    subject: "العربية",
    title: "موارد العربية — قسم اللسانيات بجامعة إلينوي",
    description: "دليل روابط للتعلم والقواعد والقواميس والمواد العربية.",
    url: "https://linguistics.illinois.edu/languages/arabic/student-resources/arabic-online-resources",
    verification: "مرجع خارجي — مراجعة المعلم مطلوبة",
  },
  {
    id: "nsf-mathematics-resources",
    subject: "الرياضيات",
    title: "موارد الرياضيات التعليمية — NSF",
    description: "دليل دروس وأنشطة وموارد رياضيات للمعلمين والطلاب.",
    url: "https://www.nsf.gov/focus-areas/mathematics/educational-resources",
    verification: "مرجع خارجي — مراجعة المعلم مطلوبة",
  },
];

export function resourcesForSubject(subject: string): TeachingResource[] {
  return TEACHING_RESOURCES.filter((resource) => resource.subject === subject || subject.includes(resource.subject));
}
