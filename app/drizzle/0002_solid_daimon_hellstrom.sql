CREATE TABLE "app"."companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"address" varchar(500),
	"country" varchar(50),
	"official_site" varchar(255),
	"exchange" varchar(50),
	"industry_id" integer
);
--> statement-breakpoint
CREATE TABLE "app"."financial_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"stock_id" integer,
	"revenue_ttm" numeric(20, 2),
	"profit_margin" numeric(6, 3),
	"operating_margin_ttm" numeric(6, 3),
	"return_on_assets_ttm" numeric(6, 3),
	"return_on_equity_ttm" numeric(6, 3),
	"quarter_ending" date
);
--> statement-breakpoint
CREATE TABLE "app"."industries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"sector_id" integer,
	CONSTRAINT "industries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."sectors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "sectors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."stocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"currency" varchar(5) DEFAULT 'USD',
	"market_cap" numeric(20, 2),
	"pe_ratio" numeric(10, 2),
	"eps" numeric(10, 2),
	"dividend_yield" numeric(6, 4),
	"beta" numeric(6, 3),
	"analyst_target_price" numeric(12, 2),
	"fiscal_year_end" timestamp,
	"latest_quarter" date,
	"last_updated" timestamp DEFAULT now(),
	"company_id" integer,
	CONSTRAINT "stocks_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
ALTER TABLE "app"."companies" ADD CONSTRAINT "companies_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "app"."industries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."financial_metrics" ADD CONSTRAINT "financial_metrics_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "app"."stocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."industries" ADD CONSTRAINT "industries_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "app"."sectors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."stocks" ADD CONSTRAINT "stocks_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "app"."companies"("id") ON DELETE cascade ON UPDATE no action;