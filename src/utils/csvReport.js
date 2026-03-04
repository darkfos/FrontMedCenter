/**
 * Экранирование ячейки для CSV (запятые, переносы, кавычки).
 */
function escapeCsvCell(value) {
  if (value == null) return '';
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

/**
 * Собрать CSV из массива заголовков и строк (массивы значений).
 */
export function buildCsvFromRows(headers, rows) {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const dataLines = rows.map((row) => row.map(escapeCsvCell).join(','));
  return [headerLine, ...dataLines].join('\r\n');
}

/**
 * Скачать строку как файл .csv в кодировке UTF-8 с BOM для Excel.
 */
export function downloadCsv(filename, csvString) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Сформировать CSV и скачать отчёт по пользователям.
 * data: { rows: Array<{ id, fullName, email, phone, userType, consultationsThisMonth, historyRecordsCount, historyDiseasesSummary }> }
 */
export function buildUsersReportCsv(data) {
  const headers = [
    'ID',
    'ФИО',
    'Email',
    'Телефон',
    'Тип',
    'Консультаций за месяц',
    'Записей в истории болезней',
    'История болезней (кратко)',
  ];
  const rows = (data?.rows ?? []).map((r) => [
    r.id ?? '',
    r.fullName ?? '',
    r.email ?? '',
    r.phone ?? '',
    r.userType ?? '',
    r.consultationsThisMonth ?? 0,
    r.historyRecordsCount ?? 0,
    r.historyDiseasesSummary ?? '',
  ]);
  return buildCsvFromRows(headers, rows);
}

/**
 * Сформировать CSV и скачать медицинский отчёт.
 * data: { totalPatients, totalVisitsThisMonth, byDoctor: Array<{ doctorName, visitCount, uniquePatients }>, topDiagnoses: Array<{ disease, count }> }
 */
export function buildMedicalReportCsv(data) {
  const lines = [];

  lines.push('Сводка');
  lines.push(['Показатель', 'Значение'].map(escapeCsvCell).join(','));
  lines.push(
    [
      'Всего уникальных пациентов (карточек)',
      String(data?.totalPatients ?? 0),
    ].map(escapeCsvCell).join(',')
  );
  lines.push(
    ['Обращений за месяц', String(data?.totalVisitsThisMonth ?? 0)].map(
      escapeCsvCell
    ).join(',')
  );
  lines.push('');

  lines.push('Статистика по врачам (за месяц)');
  lines.push(
    ['Врач', 'Количество приёмов', 'Уникальных пациентов']
      .map(escapeCsvCell)
      .join(',')
  );
  for (const r of data?.byDoctor ?? []) {
    lines.push(
      [r.doctorName ?? '', r.visitCount ?? 0, r.uniquePatients ?? 0]
        .map(escapeCsvCell)
        .join(',')
    );
  }
  lines.push('');

  lines.push('Топ диагнозов за месяц');
  lines.push(['Диагноз', 'Количество'].map(escapeCsvCell).join(','));
  for (const r of data?.topDiagnoses ?? []) {
    lines.push([r.disease ?? '', r.count ?? 0].map(escapeCsvCell).join(','));
  }

  return lines.join('\r\n');
}

/**
 * Сформировать CSV финансового отчёта.
 */
export function buildFinancialReportCsv(data) {
  const headers = ['Показатель', 'Значение'];
  const rows = [
    ['Выручка за сегодня (₽)', String(data?.revenueToday ?? 0)],
    ['Рост выручки к прошлой неделе (%)', String(data?.revenueGrowthPercent ?? 0)],
    ['Записей на приём сегодня', String(data?.appointmentsToday ?? 0)],
  ];
  return buildCsvFromRows(headers, rows);
}
