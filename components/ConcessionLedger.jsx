'use client';

import { useState } from 'react';

const displayValue = (value, fallback = '—') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

export default function ConcessionLedger({ entries = [], onExport }) {
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleExport = async () => {
    if (!entries.length || exporting) return;

    setExporting(true);
    setStatus({ type: 'info', message: 'Building CSV…' });

    try {
      let result;

      if (onExport) {
        result = await onExport(entries);
      } else {
        const res = await fetch('/api/export-ledger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entries }),
        });

        if (!res.ok) throw new Error('Export request failed');

        const contentType = res.headers.get('content-type') || '';
        result = contentType.includes('application/json') ? await res.json() : await res.text();
      }

      let filename = 'concession-ledger.csv';
      let csv = '';

      if (typeof result === 'string') {
        csv = result;
      } else if (result?.csv) {
        filename = result.filename || filename;
        csv = result.csv;
      } else if (result?.url) {
        const link = document.createElement('a');
        link.href = result.url;
        link.download = result.filename || filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setStatus({ type: 'success', message: 'Ledger exported.' });
        return;
      } else {
        throw new Error('Unexpected export response');
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: 'Ledger exported.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Export failed.' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="ledger" aria-labelledby="concession-ledger-title">
      <div className="ledger-header">
        <div>
          <h2 id="concession-ledger-title">Concession Ledger</h2>
          <p className="ledger-subtitle">Every trade, tracked like a spreadsheet with feelings.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleExport}
          disabled={!entries.length || exporting}
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {status.message ? <p className={`ledger-status ${status.type}`}>{status.message}</p> : null}

      {entries.length ? (
        <div className="ledger-scroll">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Round</th>
                <th>Side</th>
                <th>Item</th>
                <th>Before</th>
                <th>After</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id ?? index}>
                  <td>{displayValue(entry.round)}</td>
                  <td>{displayValue(entry.side)}</td>
                  <td>{displayValue(entry.item)}</td>
                  <td>{displayValue(entry.before)}</td>
                  <td>{displayValue(entry.after)}</td>
                  <td>{displayValue(entry.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="ledger-empty">
          No concessions yet. Start the negotiation to make the recruiter pay for patience.
        </p>
      )}
    </section>
  );
}