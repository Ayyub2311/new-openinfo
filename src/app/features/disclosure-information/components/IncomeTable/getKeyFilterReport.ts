export function getKeyFilterReport(reports: { title_id: number; tnum?: string }[]) {
  let und_tnum_count = 0;
  for (let index = 0; index < reports.length; index++) {
    const report = reports[index];
    if (report.tnum === undefined) und_tnum_count++;
  }

  if (und_tnum_count > 0) return "title_id";
  return "tnum";
}
