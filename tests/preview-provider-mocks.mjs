export const providerCalls = { inserts: [], emails: [] };
let databaseError = null;

export function resetProviderCalls() {
  providerCalls.inserts.length = 0;
  providerCalls.emails.length = 0;
  databaseError = null;
}

export function failNextDatabaseWrite(error) {
  databaseError = error;
}

export function getSupabaseAdmin() {
  return {
    from(table) {
      return {
        select() { return { eq() { return { async maybeSingle() { return { data: { id: `${table}-existing` }, error: null }; } }; } }; },
        insert(rows) {
          providerCalls.inserts.push({ table, rows });
          return {
            select(columns) {
              return {
                async single() {
                  const row = rows[0];
                  if (databaseError) {
                    const error = databaseError;
                    databaseError = null;
                    return { data: null, error, count: null, status: 500, statusText: 'Error' };
                  }
                  return {
                    data: {
                      id: `${table}-id`,
                      email: row.email,
                      full_name: row.full_name,
                      first_name: row.first_name,
                      name: row.name,
                      status: row.status,
                      created_at: '2026-09-08T12:00:00.000Z',
                    },
                    error: null,
                    count: null,
                    status: 201,
                    statusText: 'Created',
                  };
                },
              };
            },
          };
        },
      };
    },
  };
}

export async function sendNewApplicationEmails(payload) {
  providerCalls.emails.push({ kind: 'application', payload });
}
export async function sendWaitlistEmails(payload) {
  providerCalls.emails.push({ kind: 'waitlist', payload });
}
export async function sendSponsorEmails(payload) {
  providerCalls.emails.push({ kind: 'sponsor', payload });
}
export async function sendStatusUpdateEmails(payload) {
  providerCalls.emails.push({ kind: 'status', payload });
}
