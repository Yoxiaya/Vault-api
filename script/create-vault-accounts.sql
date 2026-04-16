CREATE TABLE IF NOT EXISTS accounts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	appName TEXT NOT NULL,
	username TEXT NOT NULL,
	password TEXT NOT NULL,
	email TEXT,
	webSite TEXT,
	category TEXT,
	logoUrl TEXT,
	lastUpdated TEXT,
	twoFactorEnabled INTEGER DEFAULT 0,
	storageType TEXT,
	description TEXT
);