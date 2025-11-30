import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const prompts = pgTable(
	"prompts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		content: text("content").notNull(),
		category: text("category").notNull(),
		tags: text("tags").array().notNull().default([]),
		author: text("author").notNull(),
		userId: uuid("user_id").notNull(),
		favoritesCount: integer("favorites_count").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [
		index("prompts_category_idx").on(t.category),
		index("prompts_created_at_idx").on(t.createdAt),
		index("prompts_user_id_idx").on(t.userId),
	],
);

export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;

export const promptFavorites = pgTable(
	"prompt_favorites",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		promptId: uuid("prompt_id")
			.notNull()
			.references(() => prompts.id, { onDelete: "cascade" }),
		userId: uuid("user_id").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [
		index("prompt_favorites_user_id_idx").on(t.userId),
		index("prompt_favorites_prompt_id_idx").on(t.promptId),
	],
);

export type PromptFavorite = typeof promptFavorites.$inferSelect;
export type NewPromptFavorite = typeof promptFavorites.$inferInsert;
