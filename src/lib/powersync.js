//This file initializes local SQLite, syncs changes to Supabase when online, and provides a single cmsDb API for your CMS and member pages.

import { createClient } from '@supabase/supabase-js';
import { column, Schema, Table, PowerSyncDatabase, UpdateType } from '@powersync/web';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const POWERSYNC_URL = import.meta.env.VITE_POWERSYNC_URL || '';

export const isCloudConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY && POWERSYNC_URL);

export const supabase =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// PowerSync automatically creates the primary key `id` column on every Table
const cms_items = new Table(
  {
    module: column.text,
    title: column.text,
    category: column.text,
    arabic: column.text,
    translation: column.text,
    content: column.text,
    reference: column.text,
    metadata: column.text, // JSON string in SQLite <-> jsonb in Supabase
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
  facilities: column.text, // JSON string in SQLite <-> jsonb in Supabase
  timings: column.text,    // JSON string in SQLite <-> jsonb in Supabase
  status: column.text,
  created_at: column.text,
  updated_at: column.text,
});

export const AppSchema = new Schema({ cms_items, masjids });

export const powerSyncDb = new PowerSyncDatabase({
  schema: AppSchema,
  database: { dbFilename: 'aamaal_cms_v1.db' },
});

const JSON_COLUMNS = new Set(['metadata', 'facilities', 'timings']);

function hydratePayloadForSupabase(opData = {}) {
  const clean = { ...opData };
  Object.keys(clean).forEach((key) => {
    if (JSON_COLUMNS.has(key) && typeof clean[key] === 'string') {
      try {
        clean[key] = JSON.parse(clean[key]);
      } catch (_) {}
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
        const record = hydratePayloadForSupabase(op.opData);

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
      // Leave transaction in queue so PowerSync retries automatically when back online
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

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function safeParseJson(str, fallback) {
  if (typeof str !== 'string') return str ?? fallback;
  try {
    return JSON.parse(str);
  } catch (_) {
    return fallback;
  }
}

// Reusable Offline-First CRUD API for Admin CMS & Member Views
export const cmsDb = {
  async listItems(module) {
    await initPowerSync();
    const rows = await powerSyncDb.getAll(
      'SELECT * FROM cms_items WHERE module = ? ORDER BY updated_at DESC',
      [module]
    );
    return rows.map((r) => ({ ...r, metadata: safeParseJson(r.metadata, {}) }));
  },

  async saveItem(item) {
    await initPowerSync();
    const now = new Date().toISOString();
    const id = item.id || generateUuid();
    const metaJson = JSON.stringify(item.metadata || {});

    if (item.id) {
      await powerSyncDb.execute(
        `UPDATE cms_items
         SET title = ?, category = ?, arabic = ?, translation = ?, content = ?, reference = ?, metadata = ?, status = ?, updated_at = ?
         WHERE id = ?`,
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
      facilities: safeParseJson(r.facilities, []),
      timings: safeParseJson(r.timings, {}),
    }));
  },

  async saveMasjid(masjid) {
    await initPowerSync();
    const now = new Date().toISOString();
    const id = masjid.id || generateUuid();
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