-- CreateTable
CREATE TABLE "announcements" (
    "announcementid" SERIAL NOT NULL,
    "eventid" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),
    "updated_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("announcementid")
);

-- CreateTable
CREATE TABLE "events" (
    "eventid" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "image_banner" VARCHAR(255),
    "time_start" TIMESTAMP(6),
    "time_end" TIMESTAMP(6),
    "location" VARCHAR(255),
    "keynote_speaker" VARCHAR(255),
    "description" VARCHAR(1000),
    "survey_link" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),
    "updated_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),

    CONSTRAINT "events_pkey" PRIMARY KEY ("eventid")
);

-- CreateTable
CREATE TABLE "help" (
    "helpid" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "subtitle" VARCHAR(255),
    "description" VARCHAR(999),
    "image" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),
    "updated_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),

    CONSTRAINT "help_pkey" PRIMARY KEY ("helpid")
);

-- CreateTable
CREATE TABLE "importantinfo" (
    "infoid" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "subtitle" VARCHAR(255),
    "description" VARCHAR(999),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "image" VARCHAR(255),

    CONSTRAINT "importantinfo_pkey" PRIMARY KEY ("infoid")
);

-- CreateTable
CREATE TABLE "marker" (
    "mapid" SERIAL NOT NULL,
    "location_name" VARCHAR(255),
    "category" VARCHAR(255),
    "description" VARCHAR(255),
    "coordinates" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),
    "updated_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),
    "image" VARCHAR(255),

    CONSTRAINT "marker_pkey" PRIMARY KEY ("mapid")
);

-- CreateTable
CREATE TABLE "role" (
    "roleid" SERIAL NOT NULL,
    "username" VARCHAR(255),
    "password" VARCHAR(255),
    "type" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),
    "updated_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),

    CONSTRAINT "role_pkey" PRIMARY KEY ("roleid")
);

-- CreateTable
CREATE TABLE "savedevent" (
    "savedid" SERIAL NOT NULL,
    "uid" VARCHAR(500),
    "eventid" INTEGER,

    CONSTRAINT "savedevent_pkey" PRIMARY KEY ("savedid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "company" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore'::text),
    "uid" VARCHAR(500),
    "type" VARCHAR(255),
    "linkedinurl" VARCHAR(255),
    "jobtitle" VARCHAR(255),
    "profile_pic" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE INDEX "idx_announcements_eventid" ON "announcements"("eventid");

-- CreateIndex
CREATE INDEX "idx_savedevent_uid" ON "savedevent"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "uq_users_uid" ON "users"("uid");

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "fk_announcements_eventid" FOREIGN KEY ("eventid") REFERENCES "events"("eventid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "savedevent" ADD CONSTRAINT "fk_savedevent_eventid" FOREIGN KEY ("eventid") REFERENCES "events"("eventid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "savedevent" ADD CONSTRAINT "fk_savedevent_uid" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE CASCADE ON UPDATE NO ACTION;
