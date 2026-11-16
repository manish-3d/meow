import dns from 'node:dns';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Windows DNS Fix for Neon AWS Tech hostnames (prevents getaddrinfo ENOTFOUND)
if (typeof window === 'undefined') {
  try {
    dns.setDefaultResultOrder?.('ipv4first');
    dns.setServers?.(['8.8.8.8', '1.1.1.1']);

    const originalLookup = dns.lookup;
    const patchedLookup = (hostname: any, options: any, callback: any) => {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (hostname && typeof hostname === 'string' && (hostname.includes('neon.tech') || hostname.includes('aws'))) {
        dns.resolve(hostname, (err, addresses) => {
          if (err || !addresses || addresses.length === 0) {
            return originalLookup(hostname, options, callback);
          }
          if (options && options.all) {
            return callback(null, addresses.map((addr) => ({ address: addr, family: 4 })));
          }
          return callback(null, addresses[0], 4);
        });
      } else {
        originalLookup(hostname, options, callback);
      }
    };
    (patchedLookup as any).__promisify__ = (originalLookup as any).__promisify__;
    (dns as any).lookup = patchedLookup;
  } catch (e) {
    // ignore
  }
}

const databaseUrl = process.env.DATABASE_URL || 'postgresql://placeholder-url';

const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle({ client, schema });
export * from '@/db/schema';
