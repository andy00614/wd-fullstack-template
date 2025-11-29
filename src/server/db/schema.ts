import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const posts = pgTable(
	"posts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		content: text("content"),
		userId: uuid("user_id").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [index("posts_user_id_idx").on(t.userId)],
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
