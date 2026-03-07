export default function MiniChart({ bills }) {
  // Group bills by month (last 6 months)
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('fr-FR', { month: 'short' }),
      count: 0,
      amount: 0,
    });
  }

  bills.forEach(bill => {
    if (!bill.date) return;
    const d = new Date(bill.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const month = months.find(m => m.key === key);
    if (month) {
      month.count++;
      month.amount += bill.amount;
    }
  });

  const maxAmount = Math.max(...months.map(m => m.amount), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Dépenses (6 derniers mois)</h3>
      <div className="flex items-end gap-2 h-24">
        {months.map((m) => {
          const height = Math.max((m.amount / maxAmount) * 100, 4);
          return (
            <div key={m.key} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex justify-center">
                <div
                  className="w-full max-w-[32px] bg-gray-900 rounded-md transition-all duration-300 hover:bg-gray-700 cursor-default"
                  style={{ height: `${height}%`, minHeight: '3px' }}
                  title={`${m.amount.toFixed(2)} € (${m.count} facture${m.count > 1 ? 's' : ''})`}
                />
              </div>
              <span className="text-[10px] text-gray-400 uppercase">{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
