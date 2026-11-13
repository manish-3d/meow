import dns from "node:dns";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

// Ensure IPv4 resolution first
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

// Resilient DNS lookup hook for Neon cloud endpoints across local router DNS outages
const resolver = new dns.Resolver();
try {
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);
  const origLookup = dns.lookup.bind(dns);

  (dns as any).lookup = (hostname: string, options: any, callback: any) => {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (hostname && hostname.includes("neon.tech")) {
      resolver.resolve4(hostname, (err, addrs) => {
        if (!err && addrs && addrs.length > 0) {
          if (options && options.all) {
            return callback(
              null,
              addrs.map((a) => ({ address: a, family: 4 })),
            );
          }
          return callback(null, addrs[0], 4);
        }
        origLookup(hostname, options, callback);
      });
    } else {
      origLookup(hostname, options, callback);
    }
  };
} catch {}

const databaseUrl = process.env.DATABASE_URL || "postgresql://placeholder-url";

const client = postgres(databaseUrl, {
  prepare: false,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 30,
});
export const db = drizzle({ client, schema });
export * from "@/db/schema";
