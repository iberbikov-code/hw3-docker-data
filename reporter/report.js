const fs = require('fs');
const { parse } = require('csv-parse/sync');

const input = fs.readFileSync('/data/data.csv', 'utf8');
const records = parse(input, { columns: true, skip_empty_lines: true });

if (records.length === 0) {
  console.error('CSV пустой');
  process.exit(1);
}

const columns = Object.keys(records[0]);

const numericStats = {};
const categoricalStats = {};

for (const col of columns) {
  const rawValues = records.map(r => r[col]);
  const numericValues = rawValues.map(v => parseFloat(v)).filter(v => !isNaN(v));

  if (numericValues.length === rawValues.length) {
    numericStats[col] = {
      count: numericValues.length,
      min: Math.min(...numericValues).toFixed(2),
      max: Math.max(...numericValues).toFixed(2),
      mean: (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2),
    };
  } else {
    const freq = {};
    for (const v of rawValues) {
      freq[v] = (freq[v] || 0) + 1;
    }
    categoricalStats[col] = freq;
  }
}

// Генерируем HTML-таблицу для числовых колонок
const numericRows = Object.entries(numericStats)
  .map(([col, s]) => `
    <tr>
      <td>${col}</td>
      <td>${s.count}</td>
      <td>${s.min}</td>
      <td>${s.max}</td>
      <td>${s.mean}</td>
    </tr>
  `)
  .join('');

const numericTable = `
  <h2>Числовые колонки</h2>
  <table border="1" style="border-collapse: collapse; margin: 10px 0;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="padding: 8px; border: 1px solid #ddd;">Колонка</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Кол-во</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Min</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Max</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Среднее</th>
      </tr>
    </thead>
    <tbody>
      ${numericRows || '<tr><td colspan="5" style="padding: 8px; text-align: center;">Нет числовых колонок</td></tr>'}
    </tbody>
  </table>
`;

// Генерируем HTML-таблицы для категориальных колонок
const categoricalTables = Object.entries(categoricalStats)
  .map(([col, freq]) => {
    const freqRows = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([val, cnt]) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${val}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${cnt}</td>
        </tr>
      `)
      .join('');
    
    return `
      <h2>Колонка: ${col}</h2>
      <table border="1" style="border-collapse: collapse; margin: 10px 0;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd;">Значение</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Кол-во</th>
          </tr>
        </thead>
        <tbody>
          ${freqRows}
        </tbody>
      </table>
    `;
  })
  .join('');

const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Отчёт по данным</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background-color: #f9f9f9;
    }
    h1 {
      color: #333;
    }
    h2 {
      color: #555;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <h1>📊 Отчёт по данным</h1>
  <p><strong>Всего строк:</strong> ${records.length}</p>
  
  ${numericTable}
  ${categoricalTables}
</body>
</html>
`;

fs.writeFileSync('/data/report.html', html);
console.log('Отчёт сохранён: /data/report.html');