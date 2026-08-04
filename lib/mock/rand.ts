// Deterministic pseudo-random helpers for generating mock data. Using a
// seeded generator (rather than Math.random()) keeps output identical
// between server and client renders, avoiding React hydration mismatches.

export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed: number) {
  const rand = mulberry32(seed);
  return {
    next: () => rand(),
    int: (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min,
    pick<T>(arr: readonly T[]): T {
      return arr[Math.floor(rand() * arr.length)];
    },
    pickMany<T>(arr: readonly T[], count: number): T[] {
      const pool = [...arr];
      const out: T[] = [];
      for (let i = 0; i < count && pool.length > 0; i++) {
        const idx = Math.floor(rand() * pool.length);
        out.push(pool.splice(idx, 1)[0]);
      }
      return out;
    },
    bool: (probability = 0.5) => rand() < probability,
    dateWithinDays: (daysAgo: number) => {
      const d = new Date(2026, 7, 4);
      d.setDate(d.getDate() - Math.floor(rand() * daysAgo));
      return d.toISOString().slice(0, 10);
    },
  };
}

export const FIRST_NAMES_M = [
  "David", "Peter", "James", "John", "Daniel", "Joseph", "Samuel", "Isaac", "Emmanuel", "Brian",
  "Kevin", "Ronald", "Andrew", "Moses", "Joshua", "Ivan", "Allan", "Denis", "Martin", "Robert",
];
export const FIRST_NAMES_F = [
  "Sarah", "Grace", "Patricia", "Ruth", "Esther", "Joan", "Irene", "Diana", "Mary", "Faith",
  "Joyce", "Cynthia", "Winnie", "Brenda", "Sandra", "Juliet", "Agnes", "Prossy", "Doreen", "Sheila",
];
export const LAST_NAMES = [
  "Okello", "Nakato", "Ssewanyana", "Namuli", "Kato", "Nabatanzi", "Mugisha", "Kirabo", "Tumusiime",
  "Ochieng", "Nantongo", "Byaruhanga", "Kyeyune", "Nalwoga", "Ssekandi", "Namubiru", "Kwesiga",
  "Atim", "Wasswa", "Nakigudde", "Muwanguzi", "Nabirye", "Ainembabazi", "Kizza", "Namara",
];

export function fullName(rng: ReturnType<typeof makeRng>, gender?: "Male" | "Female") {
  const g = gender ?? rng.pick(["Male", "Female"] as const);
  const first = g === "Male" ? rng.pick(FIRST_NAMES_M) : rng.pick(FIRST_NAMES_F);
  const last = rng.pick(LAST_NAMES);
  return { first, last, gender: g as "Male" | "Female" };
}
