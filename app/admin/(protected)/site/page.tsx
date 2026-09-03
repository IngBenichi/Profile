import { prisma } from "@/lib/prisma";
import SiteEditor from "@/components/admin/site-editor";

export const dynamic = "force-dynamic";

const L = (v: unknown) => {
  const o = (v ?? {}) as { es?: string; en?: string };
  return { es: o.es ?? "", en: o.en ?? "" };
};

export default async function SitePage() {
  const s = await prisma.siteContent.findUnique({ where: { id: 1 } });
  if (!s) return <p style={{ fontFamily: "monospace" }}>SiteContent sin sembrar.</p>;

  return (
    <SiteEditor
      initial={{
        heroName: s.heroName,
        heroRealName: s.heroRealName,
        eduInstitution: s.eduInstitution,
        heroBadge: L(s.heroBadge),
        heroTitle: L(s.heroTitle),
        heroCopy: L(s.heroCopy),
        aboutEyebrow: L(s.aboutEyebrow),
        aboutP1: L(s.aboutP1),
        aboutP2: L(s.aboutP2),
        timelineTitle: L(s.timelineTitle),
        stackEyebrow: L(s.stackEyebrow),
        stackIntro: L(s.stackIntro),
        credEyebrow: L(s.credEyebrow),
        workEyebrow: L(s.workEyebrow),
        workIntro: L(s.workIntro),
        expEyebrow: L(s.expEyebrow),
        eduTitle: L(s.eduTitle),
        eduDegree: L(s.eduDegree),
        eduPeriod: L(s.eduPeriod),
        contactEyebrow: L(s.contactEyebrow),
        contactTitle: L(s.contactTitle),
        contactCopy: L(s.contactCopy),
        footer: L(s.footer),
      }}
    />
  );
}
