CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT DEFAULT '',
  focus_chips TEXT[] DEFAULT ARRAY['Ease in Affairs', 'Daily Dhikr'],
  dhikr_count INT DEFAULT 0,
  sessions_count INT DEFAULT 0,
  reminders_count INT DEFAULT 1,
  tasbih_current INT DEFAULT 0,
  tasbih_target INT DEFAULT 33,
  active_phrase_id TEXT DEFAULT 'subhanallah',
  saved_dua_ids TEXT[] DEFAULT ARRAY['ease-in-affairs'],
  story_lesson INT DEFAULT 2,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS duas (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  badge TEXT NOT NULL,
  title TEXT NOT NULL,
  short_desc TEXT,
  arabic TEXT NOT NULL,
  translit TEXT NOT NULL,
  translation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS story_lessons (
  lesson INT PRIMARY KEY,
  story_id TEXT NOT NULL DEFAULT 'valley-of-makkah',
  subtitle TEXT NOT NULL,
  arabic TEXT NOT NULL,
  translit TEXT NOT NULL,
  translation TEXT NOT NULL
);
