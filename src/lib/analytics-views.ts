import { getDb } from "./db";

export interface DailyViewPoint {
  date: string; // YYYY-MM-DD
  label: string; // e.g. Mar 24
  views: number;
}

function formatLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function getViewsByDate(days = 30): Promise<DailyViewPoint[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  try {
    const db = await getDb();
    const rows = await db
      .collection("analytics")
      .aggregate<{ _id: string; count: number }>([
        { $match: { timestamp: { $gte: start } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    for (const row of rows) {
      if (buckets.has(row._id)) {
        buckets.set(row._id, row.count);
      }
    }
  } catch {
    /* empty chart on DB failure */
  }

  return Array.from(buckets.entries()).map(([date, views]) => ({
    date,
    label: formatLabel(date),
    views,
  }));
}
