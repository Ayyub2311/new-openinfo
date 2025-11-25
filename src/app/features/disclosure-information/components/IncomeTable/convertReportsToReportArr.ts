export function convertReportsToReportArr(columns: { title: string; dataIndex: string }[], data: any[]) {
  const results = [];

  results.push(columns.map(col => col.title));

  data.forEach(d => {
    const row = columns.map(c => {
      return `"${d[c.dataIndex]}"`;
    });

    results.push(row);
  });

  return results;
}
