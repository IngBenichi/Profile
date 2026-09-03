"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Loc = { es: string; en: string };
type Result = { ok: true } | { ok: false; error: string };

async function guard() {
  const s = await getSession();
  if (!s) throw new Error("No autorizado");
}

function done(): Result {
  revalidatePath("/");
  return { ok: true };
}

/* -------------------------------------------------------------- site copy */
export async function saveSite(data: {
  heroName: string;
  heroRealName: string;
  eduInstitution: string;
  heroBadge: Loc; heroTitle: Loc; heroCopy: Loc;
  aboutEyebrow: Loc; aboutP1: Loc; aboutP2: Loc; timelineTitle: Loc;
  stackEyebrow: Loc; stackIntro: Loc; credEyebrow: Loc;
  workEyebrow: Loc; workIntro: Loc; expEyebrow: Loc;
  eduTitle: Loc; eduDegree: Loc; eduPeriod: Loc;
  contactEyebrow: Loc; contactTitle: Loc; contactCopy: Loc; footer: Loc;
}): Promise<Result> {
  await guard();
  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return done();
}

/* ------------------------------------------------------------- generic ops */
type Model =
  | "timelineItem"
  | "credential"
  | "project"
  | "experience"
  | "contactLink"
  | "skillHub"
  | "skillItem";

export async function removeRow(model: Model, id: number): Promise<Result> {
  await guard();
  // @ts-expect-error dynamic model access
  await prisma[model].delete({ where: { id } });
  return done();
}

export async function reorder(model: Model, ids: number[]): Promise<Result> {
  await guard();
  await prisma.$transaction(
    ids.map((id, i) =>
      // @ts-expect-error dynamic model access
      prisma[model].update({ where: { id }, data: { sortOrder: i } }),
    ),
  );
  return done();
}

/* ---------------------------------------------------------------- timeline */
export async function upsertTimeline(row: { id?: number; year: string; text: Loc }): Promise<Result> {
  await guard();
  if (row.id) {
    await prisma.timelineItem.update({ where: { id: row.id }, data: { year: row.year, text: row.text } });
  } else {
    const max = await prisma.timelineItem.aggregate({ _max: { sortOrder: true } });
    await prisma.timelineItem.create({ data: { year: row.year, text: row.text, sortOrder: (max._max.sortOrder ?? -1) + 1 } });
  }
  return done();
}

/* ------------------------------------------------------------------ skills */
export async function upsertHub(row: { id?: number; slug: string; label: Loc; color: string }): Promise<Result> {
  await guard();
  if (row.id) {
    await prisma.skillHub.update({ where: { id: row.id }, data: { slug: row.slug, label: row.label, color: row.color } });
  } else {
    const max = await prisma.skillHub.aggregate({ _max: { sortOrder: true } });
    await prisma.skillHub.create({ data: { slug: row.slug, label: row.label, color: row.color, sortOrder: (max._max.sortOrder ?? -1) + 1 } });
  }
  return done();
}

export async function upsertSkillItem(row: {
  id?: number;
  hubId: number;
  name: string;
  years: string;
  level: Loc;
}): Promise<Result> {
  await guard();
  if (row.id) {
    await prisma.skillItem.update({ where: { id: row.id }, data: { name: row.name, years: row.years, level: row.level } });
  } else {
    const max = await prisma.skillItem.aggregate({ where: { hubId: row.hubId }, _max: { sortOrder: true } });
    await prisma.skillItem.create({
      data: { hubId: row.hubId, name: row.name, years: row.years, level: row.level, sortOrder: (max._max.sortOrder ?? -1) + 1 },
    });
  }
  return done();
}

/* ------------------------------------------------------------- credentials */
export async function upsertCredential(row: { id?: number; name: Loc; imageUrl: string }): Promise<Result> {
  await guard();
  if (row.id) {
    await prisma.credential.update({ where: { id: row.id }, data: { name: row.name, imageUrl: row.imageUrl } });
  } else {
    const max = await prisma.credential.aggregate({ _max: { sortOrder: true } });
    await prisma.credential.create({ data: { name: row.name, imageUrl: row.imageUrl, sortOrder: (max._max.sortOrder ?? -1) + 1 } });
  }
  return done();
}

/* ---------------------------------------------------------------- projects */
export async function upsertProject(row: {
  id?: number;
  code: string;
  title: string;
  role: Loc;
  description: Loc;
  tech: string[];
  githubUrl: string;
  demoUrl: string | null;
  imageUrl: string;
}): Promise<Result> {
  await guard();
  const { id, ...data } = row;
  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    const max = await prisma.project.aggregate({ _max: { sortOrder: true } });
    await prisma.project.create({ data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 } });
  }
  return done();
}

/* -------------------------------------------------------------- experience */
export async function upsertExperience(row: {
  id?: number;
  company: string;
  logoUrl: string;
  position: Loc;
  period: string;
  location: Loc;
  description: Loc;
  achievements: { es: string[]; en: string[] };
}): Promise<Result> {
  await guard();
  const { id, ...data } = row;
  if (id) {
    await prisma.experience.update({ where: { id }, data });
  } else {
    const max = await prisma.experience.aggregate({ _max: { sortOrder: true } });
    await prisma.experience.create({ data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 } });
  }
  return done();
}

/* ------------------------------------------------------------ contact links */
export async function upsertContactLink(row: { id?: number; label: string; href: string }): Promise<Result> {
  await guard();
  if (row.id) {
    await prisma.contactLink.update({ where: { id: row.id }, data: { label: row.label, href: row.href } });
  } else {
    const max = await prisma.contactLink.aggregate({ _max: { sortOrder: true } });
    await prisma.contactLink.create({ data: { label: row.label, href: row.href, sortOrder: (max._max.sortOrder ?? -1) + 1 } });
  }
  return done();
}
