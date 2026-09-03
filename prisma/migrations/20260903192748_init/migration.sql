-- CreateTable
CREATE TABLE "SiteContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroName" TEXT NOT NULL DEFAULT 'BENICHI',
    "heroRealName" TEXT NOT NULL DEFAULT 'Camilo Benítez',
    "heroBadge" JSONB NOT NULL,
    "heroTitle" JSONB NOT NULL,
    "heroCopy" JSONB NOT NULL,
    "aboutEyebrow" JSONB NOT NULL,
    "aboutP1" JSONB NOT NULL,
    "aboutP2" JSONB NOT NULL,
    "timelineTitle" JSONB NOT NULL,
    "stackEyebrow" JSONB NOT NULL,
    "stackIntro" JSONB NOT NULL,
    "credEyebrow" JSONB NOT NULL,
    "workEyebrow" JSONB NOT NULL,
    "workIntro" JSONB NOT NULL,
    "expEyebrow" JSONB NOT NULL,
    "eduTitle" JSONB NOT NULL,
    "eduDegree" JSONB NOT NULL,
    "eduInstitution" TEXT NOT NULL DEFAULT 'Universidad de la Costa (CUC)',
    "eduPeriod" JSONB NOT NULL,
    "contactEyebrow" JSONB NOT NULL,
    "contactTitle" JSONB NOT NULL,
    "contactCopy" JSONB NOT NULL,
    "footer" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineItem" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "text" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TimelineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillHub" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "label" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SkillHub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillItem" (
    "id" SERIAL NOT NULL,
    "hubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "years" TEXT NOT NULL,
    "level" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SkillItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "tech" TEXT[],
    "githubUrl" TEXT NOT NULL,
    "demoUrl" TEXT,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "position" JSONB NOT NULL,
    "period" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "achievements" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactLink" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ContactLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkillHub_slug_key" ON "SkillHub"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_filename_key" ON "Asset"("filename");

-- AddForeignKey
ALTER TABLE "SkillItem" ADD CONSTRAINT "SkillItem_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "SkillHub"("id") ON DELETE CASCADE ON UPDATE CASCADE;
