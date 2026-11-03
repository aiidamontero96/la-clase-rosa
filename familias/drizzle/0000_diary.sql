CREATE TABLE diary_users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL, hash TEXT NOT NULL, salt TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, must_change INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE diary_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES diary_users(id), expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE diary_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE diary_posts (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE diary_files (id TEXT PRIMARY KEY, post_id TEXT REFERENCES diary_posts(id), name TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX diary_files_post ON diary_files(post_id);
--> statement-breakpoint
CREATE INDEX diary_sessions_user ON diary_sessions(user_id);
