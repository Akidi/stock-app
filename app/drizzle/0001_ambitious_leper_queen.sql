CREATE TABLE "app"."pings" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pings_label_unique" UNIQUE("label")
);
