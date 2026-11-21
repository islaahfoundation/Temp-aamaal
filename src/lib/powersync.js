import { createClient } from '@supabase/supabase-js';
import { column, Schema, Table, PowerSyncDatabase, UpdateType } from '@powersync/web';
import { STORAGE_KEYS, DEFAULT_CIRCLE_SETTINGS } from '../pages/admin/adminShared';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cpcqowrtzenajfrqmvpw.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QxevCBPp9l4k944zKdOecg_oCgeKyIz';
const POWERSYNC_URL = import.meta.env.VITE_POWERSYNC_URL || 'https://6b0205a4cccfdb199949a468.powersync.journeyapps.com';

export const isCloudConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY && POWERSYNC_URL);

export const supabase =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// PowerSync SQLite Schema (every table gets a primary key `id` text column automatically)
const members = new Table({
  parent_uid: column.text,
  is_primary: column.integer,
  name: column.text,
  custom_name_locked: column.integer,
  country: column.text,
  flag: column.text,
  country_locked: column.integer,
  phone: column.text,
  avatar: column.text,
  privacy: column.text,
  role: column.text,
  created_at: column.text,
  updated_at: column.text,
});

const aamaal_catalog = new Table({
  name: column.text,
  type: column.text,
  arabic: column.text,
  translation: column.text,
  description: column.text,
  target: column.integer,
  icon_key: column.text,
  status: column.text,
  active: column.integer,
  sort_order: column.integer,
  created_at: column.text,
  updated_at: column.text,
});

const recitation_logs = new Table(
  {
    aamaal_id: column.text,
    member_id: column.text,
    date_key: column.text,
    count: column.integer,
    updated_at: column.text,
  },
  { indexes: { by_member: ['member_id'], by_date: ['date_key'] } }
);

const circle_settings = new Table({
  circle_name: column.text,
  tagline: column.text,
  share_url: column.text,
  allow_family_profiles: column.integer,
  default_privacy: column.text,
  notify_new_member: column.integer,
  notify_jamaat_requests: column.integer,
  notify_broadcasts: column.integer,
  updated_at: column.text,
});

const cms_items = new Table(
  {
    module: column.text,
    title: column.text,
    category: column.text,
    arabic: column.text,
    translation: column.text,
    content: column.text,
    reference: column.text,
    metadata: column.text,
    status: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: { by_module: ['module'] } }
);

const masjids = new Table({
  name: column.text,
  area: column.text,
  address: column.text,
  facilities: column.text,
  timings: column.text,
  status: column.text,
  created_at: column.text,
  updated_at: column.text,
});

const jamaat_requests = new Table({
  masjid_id: column.text,
  masjid_name: column.text,
  prayer_key: column.text,
  proposed_jamat: column.text,
  clock_photo: column.text,
  note: column.text,
  captured_at: column.text,
  status: column.text,
  created_at: column.text,
  updated_at: column.text,
});

const broadcasts = new Table({
  title: column.text,
  category: column.text,
  time: column.text,
  days: column.text,
  icon: column.text,
  translation: column.text,
  enabled: column.integer,
  is_broadcast: column.integer,
  created_at: column.text,
});

export const AppSchema = new Schema({
  members,
  aamaal_catalog,
  recitation_logs,
  circle_settings,
  cms_items,
  masjids,
  jamaat_requests,
  broadcasts,
});

export const powerSyncDb = new PowerSyncDatabase({
  schema: AppSchema,
  database: { dbFilename: 'aamaal_circle_v1.db' },
});

const JSON_COLUMNS = new Set(['metadata', 'facilities', 'timings', 'days']);
const BOOL_COLUMNS = new Set([
  'is_primary', 'custom_name_locked', 'country_locked', 'active',
  'enabled', 'is_broadcast', 'allow_family_profiles',
  'notify_new_member', 'notify_jamaat_requests', 'notify_broadcasts',
]);

function hydrateForSupabase(opData = {}) {
  const clean = { ...opData };
  Object.keys(clean).forEach((key) => {
    if (JSON_COLUMNS.has(key) && typeof clean[key] === 'string') {
      try { clean[key] = JSON.parse(clean[key]); } catch (_) {}
    } else if (BOOL_COLUMNS.has(key) && (clean[key] === 0 || clean[key] === 1)) {
      clean[key] = Boolean(clean[key]);
    }
  });
  return clean;
}

class SupabaseConnector {
  async fetchCredentials() {
    if (!supabase || !POWERSYNC_URL) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return {
      endpoint: POWERSYNC_URL,
      token: session?.access_token || SUPABASE_KEY,
    };
  }

  async uploadData(database) {
    if (!supabase) return;
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    try {
      for (const op of transaction.crud) {
        const table = supabase.from(op.table);
        const record = hydrateForSupabase(op.opData);

        if (op.op === UpdateType.PUT) {
          const { error } = await table.upsert({ ...record, id: op.id });
          if (error) throw error;
        } else if (op.op === UpdateType.PATCH) {
          const { error } = await table.update(record).eq('id', op.id);
          if (error) throw error;
        } else if (op.op === UpdateType.DELETE) {
          const { error } = await table.delete().eq('id', op.id);
          if (error) throw error;
        }
      }
      await transaction.complete();
    } catch (err) {
      console.error('[PowerSync Upload Deferred]:', err?.message || err);
      throw err;
    }
  }
}

let initPromise = null;

export async function initPowerSync() {
  if (!initPromise) {
    initPromise = (async () => {
      await powerSyncDb.init();
      if (isCloudConfigured) {
        await powerSyncDb.connect(new SupabaseConnector());
      }
    })();
  }
  return initPromise;
}

function generateId(prefix = '') {
  const uuid =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
  return prefix ? `${prefix}_${uuid}` : uuid;
}

function toBool(v, fallback = false) {
  if (v === null || v === undefined) return fallback;
  return Boolean(Number(v));
}

function toTimestamp(v) {
  if (!v) return Date.now();
  const num = Number(v);
  if (!Number.isNaN(num) && num > 1e11) return num;
  const parsed = Date.parse(v);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

function toIso(v) {
  if (!v) return new Date().toISOString();
  if (typeof v === 'string' && v.includes('T')) return v;
  const d = new Date(Number(v) || v);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function safeJson(str, fallback) {
  if (typeof str !== 'string') return str ?? fallback;
  try { return JSON.parse(str); } catch (_) { return fallback; }
}

const mapMember = (r) => ({
  id: r.id,
  parentUid: r.parent_uid || r.id,
  isPrimary: toBool(r.is_primary, true),
  name: r.name || '',
  customNameLocked: toBool(r.custom_name_locked, false),
  country: r.country || 'India',
  flag: r.flag || '🇮🇳',
  countryLocked: toBool(r.country_locked, false),
  phone: r.phone || '',
  avatar: r.avatar || '',
  privacy: r.privacy || 'public',
  role: r.role || 'member',
  createdAt: toTimestamp(r.created_at),
  updatedAt: toTimestamp(r.updated_at),
});

const mapAamaal = (r) => ({
  id: r.id,
  name: r.name || '',
  type: r.type || 'count',
  arabic: r.arabic || '',
  translation: r.translation || '',
  description: r.description || '',
  target: Number(r.target || 1),
  iconKey: r.icon_key || 'tasbih',
  status: r.status || (toBool(r.active, true) ? 'active' : 'paused'),
  active: toBool(r.active, true),
  order: Number(r.sort_order || 0),
});

const mapLog = (r) => ({
  id: r.id,
  aamaalId: r.aamaal_id,
  memberId: r.member_id,
  dateKey: r.date_key,
  count: Number(r.count || 0),
  updatedAt: toTimestamp(r.updated_at),
});

const mapSettings = (r) =>
  r
    ? {
        circleName: r.circle_name || DEFAULT_CIRCLE_SETTINGS.circleName,
        tagline: r.tagline || DEFAULT_CIRCLE_SETTINGS.tagline,
        shareUrl: r.share_url || DEFAULT_CIRCLE_SETTINGS.shareUrl,
        allowFamilyProfiles: toBool(r.allow_family_profiles, true),
        defaultPrivacy: r.default_privacy || 'public',
        notifyNewMember: toBool(r.notify_new_member, true),
        notifyJamaatRequests: toBool(r.notify_jamaat_requests, true),
        notifyBroadcasts: toBool(r.notify_broadcasts, true),
      }
    : { ...DEFAULT_CIRCLE_SETTINGS };

const mapJamaatReq = (r) => ({
  id: r.id,
  masjidId: r.masjid_id,
  masjidName: r.masjid_name,
  prayerKey: r.prayer_key,
  proposedJamat: r.proposed_jamat,
  clockPhoto: r.clock_photo || '',
  note: r.note || '',
  capturedAt: r.captured_at || '',
  status: r.status || 'pending',
  createdAt: toTimestamp(r.created_at),
});

export const appDb = {
  async loadDashboardSnapshot(defaultAamaalList = [], fallbackAdminName = 'Ubaid') {
    await initPowerSync();

    let [memberRows, aamaalRows, logRows, reqRows, settingsRows] = await Promise.all([
      powerSyncDb.getAll('SELECT * FROM members ORDER BY created_at ASC'),
      powerSyncDb.getAll('SELECT * FROM aamaal_catalog ORDER BY sort_order ASC, created_at ASC'),
      powerSyncDb.getAll('SELECT * FROM recitation_logs'),
      powerSyncDb.getAll('SELECT * FROM jamaat_requests ORDER BY created_at DESC'),
      powerSyncDb.getAll('SELECT * FROM circle_settings WHERE id = ?', ['default']),
    ]);

    const alreadySeeded = localStorage.getItem('aamaal_powersync_migrated_v1') === 'true';
    if (!alreadySeeded && memberRows.length === 0 && aamaalRows.length === 0) {
      await this._seedOrMigrateLegacy(defaultAamaalList, fallbackAdminName);
      localStorage.setItem('aamaal_powersync_migrated_v1', 'true');
      [memberRows, aamaalRows, logRows, reqRows, settingsRows] = await Promise.all([
        powerSyncDb.getAll('SELECT * FROM members ORDER BY created_at ASC'),
        powerSyncDb.getAll('SELECT * FROM aamaal_catalog ORDER BY sort_order ASC, created_at ASC'),
        powerSyncDb.getAll('SELECT * FROM recitation_logs'),
        powerSyncDb.getAll('SELECT * FROM jamaat_requests ORDER BY created_at DESC'),
        powerSyncDb.getAll('SELECT * FROM circle_settings WHERE id = ?', ['default']),
      ]);
    }

    return {
      members: memberRows.map(mapMember),
      aamaalList: aamaalRows.map(mapAamaal),
      logs: logRows.map(mapLog),
      jamaatRequests: reqRows.map(mapJamaatReq),
      settings: mapSettings(settingsRows[0]),
    };
  },

  async _seedOrMigrateLegacy(defaultAamaalList, fallbackAdminName) {
    const readLS = (key, fallback) => {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || 'null');
        return parsed ?? fallback;
      } catch (_) {
        return fallback;
      }
    };

    const legacyMembers = readLS(STORAGE_KEYS.PROFILES, null);
    const seedMembers =
      Array.isArray(legacyMembers) && legacyMembers.length > 0
        ? legacyMembers
        : [
            {
              id: 'primary_member',
              parentUid: 'primary_member',
              isPrimary: true,
              name: fallbackAdminName || 'Ubaid',
              country: 'India',
              flag: '🇮🇳',
              privacy: 'public',
              role: 'admin',
              createdAt: Date.now(),
            },
          ];

    const legacyAamaal = readLS(STORAGE_KEYS.AAMAAL, null);
    const seedAamaal =
      Array.isArray(legacyAamaal) && legacyAamaal.length > 0 ? legacyAamaal : defaultAamaalList;
    const legacyLogs = readLS(STORAGE_KEYS.LOGS, []);
    const legacyReqs = readLS(STORAGE_KEYS.JAMAAT_REQUESTS, []);
    const legacySettings = { ...DEFAULT_CIRCLE_SETTINGS, ...readLS(STORAGE_KEYS.SETTINGS, {}) };

    await powerSyncDb.writeTransaction(async (tx) => {
      const now = new Date().toISOString();

      for (const m of seedMembers) {
        await tx.execute(
          `INSERT OR REPLACE INTO members (id, parent_uid, is_primary, name, custom_name_locked, country, flag, country_locked, phone, avatar, privacy, role, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            m.id, m.parentUid || m.id, m.isPrimary === false ? 0 : 1, m.name || 'Member',
            m.customNameLocked ? 1 : 0, m.country || 'India', m.flag || '🇮🇳',
            m.countryLocked ? 1 : 0, m.phone || '', m.avatar || '',
            m.privacy || 'public', m.role || 'member', toIso(m.createdAt), now,
          ]
        );
      }

      for (let i = 0; i < seedAamaal.length; i++) {
        const a = seedAamaal[i];
        const status = a.status || (a.active === false ? 'paused' : 'active');
        await tx.execute(
          `INSERT OR REPLACE INTO aamaal_catalog (id, name, type, arabic, translation, description, target, icon_key, status, active, sort_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            a.id, a.name, a.type || (Number(a.target) === 1 ? 'completion' : 'count'),
            a.arabic || '', a.translation || '', a.description || a.translation || '',
            Number(a.target || 1), a.iconKey || '', status, status === 'active' ? 1 : 0,
            a.order ?? i + 1, now, now,
          ]
        );
      }

      if (Array.isArray(legacyLogs)) {
        for (const l of legacyLogs) {
          if (!l?.id || Number(l.count || 0) <= 0) continue;
          await tx.execute(
            `INSERT OR REPLACE INTO recitation_logs (id, aamaal_id, member_id, date_key, count, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [l.id, l.aamaalId, l.memberId, l.dateKey, Number(l.count), toIso(l.updatedAt)]
          );
        }
      }

      if (Array.isArray(legacyReqs)) {
        for (const r of legacyReqs) {
          await tx.execute(
            `INSERT OR REPLACE INTO jamaat_requests (id, masjid_id, masjid_name, prayer_key, proposed_jamat, clock_photo, note, captured_at, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              r.id || generateId('req'), r.masjidId || '', r.masjidName || '',
              r.prayerKey || '', r.proposedJamat || '', r.clockPhoto || '',
              r.note || '', r.capturedAt || '', r.status || 'pending', now, now,
            ]
          );
        }
      }

      await tx.execute(
        `INSERT OR REPLACE INTO circle_settings (id, circle_name, tagline, share_url, allow_family_profiles, default_privacy, notify_new_member, notify_jamaat_requests, notify_broadcasts, updated_at)
         VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          legacySettings.circleName, legacySettings.tagline, legacySettings.shareUrl,
          legacySettings.allowFamilyProfiles ? 1 : 0, legacySettings.defaultPrivacy,
          legacySettings.notifyNewMember ? 1 : 0, legacySettings.notifyJamaatRequests ? 1 : 0,
          legacySettings.notifyBroadcasts ? 1 : 0, now,
        ]
      );
    });
  },

  async addMember(m) {
    await initPowerSync();
    const now = new Date().toISOString();
    const id = m.id || generateId(m.isPrimary === false ? 'fam' : 'mem');
    await powerSyncDb.execute(
      `INSERT INTO members (id, parent_uid, is_primary, name, custom_name_locked, country, flag, country_locked, phone, avatar, privacy, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, m.parentUid || id, m.isPrimary === false ? 0 : 1, m.name,
        m.customNameLocked ? 1 : 0, m.country || 'India', m.flag || '🇮🇳',
        m.countryLocked ? 1 : 0, m.phone || '', m.avatar || '',
        m.privacy || 'public', m.role || 'member', now, now,
      ]
    );
    return id;
  },

  async updateMember(id, updates) {
    await initPowerSync();
    const colMap = {
      name: 'name',
      customNameLocked: 'custom_name_locked',
      country: 'country',
      flag: 'flag',
      countryLocked: 'country_locked',
      phone: 'phone',
      avatar: 'avatar',
      privacy: 'privacy',
      role: 'role',
    };
    const sets = [];
    const params = [];
    Object.entries(updates).forEach(([k, v]) => {
      if (!colMap[k]) return;
      sets.push(`${colMap[k]} = ?`);
      params.push(typeof v === 'boolean' ? (v ? 1 : 0) : v);
    });
    if (sets.length === 0) return;
    sets.push('updated_at = ?');
    params.push(new Date().toISOString(), id);
    await powerSyncDb.execute(`UPDATE members SET ${sets.join(', ')} WHERE id = ?`, params);
  },

  async removeMemberCascade(memberId) {
    await initPowerSync();
    await powerSyncDb.writeTransaction(async (tx) => {
      const deps = await tx.getAll(
        'SELECT id FROM members WHERE is_primary = 0 AND parent_uid = ?',
        [memberId]
      );
      const ids = [memberId, ...deps.map((d) => d.id)];
      for (const id of ids) {
        await tx.execute('DELETE FROM recitation_logs WHERE member_id = ?', [id]);
        await tx.execute('DELETE FROM members WHERE id = ?', [id]);
      }
    });
  },

  async addAamaal(item, order = 0) {
    await initPowerSync();
    const now = new Date().toISOString();
    const id = item.id || generateId('aamaal');
    const status = item.status || (item.active === false ? 'paused' : 'active');
    await powerSyncDb.execute(
      `INSERT INTO aamaal_catalog (id, name, type, arabic, translation, description, target, icon_key, status, active, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, item.name, item.type || 'count', item.arabic || '',
        item.translation || '', item.description || item.translation || '',
        Number(item.target || 1), item.iconKey || 'tasbih', status,
        status === 'active' ? 1 : 0, order, now, now,
      ]
    );
    return id;
  },

  async updateAamaal(id, updates) {
    await initPowerSync();
    const colMap = {
      name: 'name',
      type: 'type',
      arabic: 'arabic',
      translation: 'translation',
      description: 'description',
      target: 'target',
      iconKey: 'icon_key',
      status: 'status',
      active: 'active',
      order: 'sort_order',
    };
    const sets = [];
    const params = [];
    Object.entries(updates).forEach(([k, v]) => {
      if (!colMap[k]) return;
      sets.push(`${colMap[k]} = ?`);
      params.push(typeof v === 'boolean' ? (v ? 1 : 0) : v);
    });
    if (sets.length === 0) return;
    sets.push('updated_at = ?');
    params.push(new Date().toISOString(), id);
    await powerSyncDb.execute(`UPDATE aamaal_catalog SET ${sets.join(', ')} WHERE id = ?`, params);
  },

  async deleteAamaal(id, permanent = false) {
    await initPowerSync();
    if (permanent) {
      await powerSyncDb.execute('DELETE FROM aamaal_catalog WHERE id = ?', [id]);
    } else {
      await this.updateAamaal(id, { status: 'deleted', active: false });
    }
  },

  async upsertLog(memberId, aamaalId, dateKey, newCount) {
    await initPowerSync();
    const logId = `${dateKey}_${aamaalId}_${memberId}`;
    if (Number(newCount) <= 0) {
      await powerSyncDb.execute('DELETE FROM recitation_logs WHERE id = ?', [logId]);
      return;
    }
    const existing = await powerSyncDb.getAll('SELECT id FROM recitation_logs WHERE id = ?', [logId]);
    const now = new Date().toISOString();
    if (existing.length > 0) {
      await powerSyncDb.execute(
        'UPDATE recitation_logs SET count = ?, updated_at = ? WHERE id = ?',
        [Number(newCount), now, logId]
      );
    } else {
      await powerSyncDb.execute(
        `INSERT INTO recitation_logs (id, aamaal_id, member_id, date_key, count, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [logId, aamaalId, memberId, dateKey, Number(newCount), now]
      );
    }
  },

  async deleteSingleLog(logId) {
    await initPowerSync();
    await powerSyncDb.execute('DELETE FROM recitation_logs WHERE id = ?', [logId]);
  },

  async resetMemberLogs(memberIds) {
    await initPowerSync();
    const ids = Array.isArray(memberIds) ? memberIds : [memberIds];
    await powerSyncDb.writeTransaction(async (tx) => {
      for (const id of ids) {
        await tx.execute('DELETE FROM recitation_logs WHERE member_id = ?', [id]);
      }
    });
  },

  async wipeAllLogs() {
    await initPowerSync();
    await powerSyncDb.execute('DELETE FROM recitation_logs');
  },

  async saveSettings(nextSettings) {
    await initPowerSync();
    const now = new Date().toISOString();
    await powerSyncDb.execute(
      `INSERT OR REPLACE INTO circle_settings (id, circle_name, tagline, share_url, allow_family_profiles, default_privacy, notify_new_member, notify_jamaat_requests, notify_broadcasts, updated_at)
       VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextSettings.circleName, nextSettings.tagline, nextSettings.shareUrl,
        nextSettings.allowFamilyProfiles ? 1 : 0, nextSettings.defaultPrivacy,
        nextSettings.notifyNewMember ? 1 : 0, nextSettings.notifyJamaatRequests ? 1 : 0,
        nextSettings.notifyBroadcasts ? 1 : 0, now,
      ]
    );
  },

  async resetCircleToDefaults(defaultAamaalList) {
    await initPowerSync();
    await powerSyncDb.writeTransaction(async (tx) => {
      const now = new Date().toISOString();
      await tx.execute('DELETE FROM recitation_logs');
      await tx.execute("DELETE FROM members WHERE id != 'primary_member'");
      await tx.execute('DELETE FROM aamaal_catalog');
      for (let i = 0; i < defaultAamaalList.length; i++) {
        const a = defaultAamaalList[i];
        await tx.execute(
          `INSERT INTO aamaal_catalog (id, name, type, arabic, translation, description, target, icon_key, status, active, sort_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 1, ?, ?, ?)`,
          [
            a.id, a.name, Number(a.target) === 1 ? 'completion' : 'count',
            a.arabic || '', a.translation || '', a.translation || '',
            Number(a.target || 1), a.iconKey || 'tasbih', i + 1, now, now,
          ]
        );
      }
    });
  },

  async approveJamaatRequest(req) {
    await initPowerSync();
    await powerSyncDb.writeTransaction(async (tx) => {
      const now = new Date().toISOString();
      const rows = await tx.getAll('SELECT * FROM masjids WHERE id = ?', [req.masjidId]);
      if (rows.length > 0) {
        const timings = safeJson(rows[0].timings, {});
        timings[req.prayerKey] = { ...(timings[req.prayerKey] || {}), jamat: req.proposedJamat };
        await tx.execute(
          'UPDATE masjids SET timings = ?, updated_at = ? WHERE id = ?',
          [JSON.stringify(timings), now, req.masjidId]
        );
      }
      await tx.execute(
        "UPDATE jamaat_requests SET status = 'approved', updated_at = ? WHERE id = ?",
        [now, req.id]
      );
    });
  },

  async rejectJamaatRequest(reqId) {
    await initPowerSync();
    await powerSyncDb.execute(
      "UPDATE jamaat_requests SET status = 'rejected', updated_at = ? WHERE id = ?",
      [new Date().toISOString(), reqId]
    );
  },

  async addBroadcast(broadcast) {
    await initPowerSync();
    const id = broadcast.id || generateId('bcast');
    await powerSyncDb.execute(
      `INSERT INTO broadcasts (id, title, category, time, days, icon, translation, enabled, is_broadcast, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?)`,
      [
        id, broadcast.title, broadcast.category || 'Admin Broadcast',
        broadcast.time || '', JSON.stringify(broadcast.days || ['Announcement']),
        broadcast.icon || '📢', broadcast.translation, new Date().toISOString(),
      ]
    );
    return id;
  },
};

export const cmsDb = {
  async listItems(module) {
    await initPowerSync();
    const rows = await powerSyncDb.getAll(
      'SELECT * FROM cms_items WHERE module = ? ORDER BY updated_at DESC',
      [module]
    );
    return rows.map((r) => ({ ...r, metadata: safeJson(r.metadata, {}) }));
  },

  async saveItem(item) {
    await initPowerSync();
    const now = new Date().toISOString();
    const id = item.id || generateId(item.module || 'cms');
    const metaJson = JSON.stringify(item.metadata || {});
    if (item.id) {
      await powerSyncDb.execute(
        `UPDATE cms_items SET title = ?, category = ?, arabic = ?, translation = ?, content = ?, reference = ?, metadata = ?, status = ?, updated_at = ? WHERE id = ?`,
        [
          item.title, item.category || '', item.arabic || '', item.translation || '',
          item.content || '', item.reference || '', metaJson, item.status || 'active', now, id,
        ]
      );
    } else {
      await powerSyncDb.execute(
        `INSERT INTO cms_items (id, module, title, category, arabic, translation, content, reference, metadata, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, item.module, item.title, item.category || '', item.arabic || '', item.translation || '',
          item.content || '', item.reference || '', metaJson, item.status || 'active', now, now,
        ]
      );
    }
    return id;
  },

  async deleteItem(id) {
    await initPowerSync();
    await powerSyncDb.execute('DELETE FROM cms_items WHERE id = ?', [id]);
  },

  async listMasjids() {
    await initPowerSync();
    const rows = await powerSyncDb.getAll('SELECT * FROM masjids ORDER BY updated_at DESC');
    return rows.map((r) => ({
      ...r,
      facilities: safeJson(r.facilities, []),
      timings: safeJson(r.timings, {}),
    }));
  },

  async saveMasjid(masjid) {
    await initPowerSync();
    const now = new Date().toISOString();
    const id = masjid.id || generateId('masjid');
    const facilitiesJson = JSON.stringify(masjid.facilities || []);
    const timingsJson = JSON.stringify(masjid.timings || {});
    if (masjid.id) {
      await powerSyncDb.execute(
        `UPDATE masjids SET name = ?, area = ?, address = ?, facilities = ?, timings = ?, status = ?, updated_at = ? WHERE id = ?`,
        [masjid.name, masjid.area || '', masjid.address || '', facilitiesJson, timingsJson, masjid.status || 'active', now, id]
      );
    } else {
      await powerSyncDb.execute(
        `INSERT INTO masjids (id, name, area, address, facilities, timings, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, masjid.name, masjid.area || '', masjid.address || '', facilitiesJson, timingsJson, masjid.status || 'active', now, now]
      );
    }
    return id;
  },

  async deleteMasjid(id) {
    await initPowerSync();
    await powerSyncDb.execute('DELETE FROM masjids WHERE id = ?', [id]);
  },
};