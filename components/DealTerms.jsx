"use client";

export default function DealTerms({ terms = {}, onChange }) {
  const minSalary = terms.minSalary ?? 0;
  const targetSalary = terms.targetSalary ?? 0;
  const dreamSalary = terms.dreamSalary ?? 0;
  const nonNegotiables = terms.nonNegotiables ?? [];
  const nonNegText = nonNegotiables.join("\n");

  const setNumber = (key) => (event) => {
    const value = Number(event.target.value);
    onChange({
      ...terms,
      [key]: Number.isFinite(value) ? value : 0,
    });
  };

  const setNonNegotiables = (event) => {
    const list = event.target.value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    onChange({
      ...terms,
      nonNegotiables: list,
    });
  };

  return (
    <section className="deal-terms panel">
      <h2>Deal Terms</h2>
      <p className="hint">
        Set the numbers your resume will defend, then list the terms you refuse to trade.
      </p>

      <div className="term-grid">
        <label>
          <span>Minimum acceptable salary</span>
          <input
            type="number"
            min="0"
            step="1000"
            value={minSalary}
            onChange={setNumber("minSalary")}
          />
        </label>

        <label>
          <span>Target salary</span>
          <input
            type="number"
            min="0"
            step="1000"
            value={targetSalary}
            onChange={setNumber("targetSalary")}
          />
        </label>

        <label>
          <span>Dream salary</span>
          <input
            type="number"
            min="0"
            step="1000"
            value={dreamSalary}
            onChange={setNumber("dreamSalary")}
          />
        </label>
      </div>

      <label className="non-negotiables">
        <span>Non-negotiables</span>
        <textarea
          rows={5}
          placeholder={
            "One per line, e.g.\nRemote 3 days/week\nNo signing bonus below 10%\nTitle: Senior Engineer"
          }
          value={nonNegText}
          onChange={setNonNegotiables}
        />
      </label>

      {nonNegotiables.length > 0 && (
        <div className="chips">
          {nonNegotiables.map((item, index) => (
            <span key={`${item}-${index}`} className="chip">
              {item}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}