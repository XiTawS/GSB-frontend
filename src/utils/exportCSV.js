/**
 * Export an array of bills to a downloadable CSV file.
 * Uses semicolons as separators (Excel-friendly for French locale).
 * Includes BOM for proper UTF-8 encoding in Excel.
 */

export function exportToCSV(bills, filename = 'factures.csv') {
  const STATUS_FR = { Approved: 'Validée', Rejected: 'Rejetée', Pending: 'En attente' };
  const headers = ['Titre', 'Date', 'Type', 'Montant', 'Statut', 'Description'];

  const rows = bills.map(b => [
    `"${(b.title || '').replace(/"/g, '""')}"`,
    new Date(b.date).toLocaleDateString('fr-FR'),
    b.type || '',
    b.amount?.toFixed(2) || '0.00',
    STATUS_FR[b.status] || b.status,
    `"${(b.description || '').replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');

  // BOM + CSV blob for Excel compatibility
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
