import { v4 as uuid } from "uuid";
import type { EstimatorConfig, LineItem, SurfaceType } from "../types";
import { SURFACE_TYPES, surfaceLabel, surfaceMultiplier } from "../data/surfaceTypes";
import { Field, NumberInput } from "./Field";

function money(n: number): string {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function BudgetEstimator({
  estimator,
  onChangeEstimator,
  onAddLineItems,
}: {
  estimator: EstimatorConfig;
  onChangeEstimator: (estimator: EstimatorConfig) => void;
  onAddLineItems: (items: LineItem[]) => void;
}) {
  const sqFt = Math.max(0, estimator.widthFt) * Math.max(0, estimator.heightFt);
  const multiplier = surfaceMultiplier(estimator.surfaceType);
  const paintingCost = sqFt * estimator.ratePerSqFt * multiplier;
  const total = paintingCost + estimator.designFee + estimator.travelFee;

  function addToBudget() {
    const items: LineItem[] = [
      {
        id: uuid(),
        label: `Mural painting (${estimator.widthFt}' × ${estimator.heightFt}' = ${sqFt.toLocaleString()} sq ft)`,
        detail: `${surfaceLabel(estimator.surfaceType)} · $${estimator.ratePerSqFt}/sq ft`,
        amount: Math.round(paintingCost),
      },
    ];
    if (estimator.designFee > 0) {
      items.push({
        id: uuid(),
        label: "Design & concept development",
        detail: "",
        amount: estimator.designFee,
      });
    }
    if (estimator.travelFee > 0) {
      items.push({
        id: uuid(),
        label: "Travel / equipment",
        detail: "",
        amount: estimator.travelFee,
      });
    }
    onAddLineItems(items);
  }

  return (
    <details className="rounded border border-stone-200">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-stone-700">
        Pricing estimator
      </summary>
      <div className="flex flex-col gap-3 border-t border-stone-200 p-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Wall width (ft)">
            <NumberInput
              value={estimator.widthFt}
              onChange={(e) => onChangeEstimator({ ...estimator, widthFt: Number(e.target.value) })}
            />
          </Field>
          <Field label="Wall height (ft)">
            <NumberInput
              value={estimator.heightFt}
              onChange={(e) => onChangeEstimator({ ...estimator, heightFt: Number(e.target.value) })}
            />
          </Field>
        </div>
        <Field label="Surface type">
          <select
            className="w-full rounded border border-stone-300 px-2.5 py-1.5 text-sm"
            value={estimator.surfaceType}
            onChange={(e) => onChangeEstimator({ ...estimator, surfaceType: e.target.value as SurfaceType })}
          >
            {SURFACE_TYPES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({s.multiplier}×)
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Rate / sq ft">
            <NumberInput
              value={estimator.ratePerSqFt}
              onChange={(e) => onChangeEstimator({ ...estimator, ratePerSqFt: Number(e.target.value) })}
            />
          </Field>
          <Field label="Design fee">
            <NumberInput
              value={estimator.designFee}
              onChange={(e) => onChangeEstimator({ ...estimator, designFee: Number(e.target.value) })}
            />
          </Field>
          <Field label="Travel fee">
            <NumberInput
              value={estimator.travelFee}
              onChange={(e) => onChangeEstimator({ ...estimator, travelFee: Number(e.target.value) })}
            />
          </Field>
        </div>
        <div className="rounded bg-stone-50 p-3 text-sm">
          <div className="flex justify-between text-stone-500">
            <span>
              {sqFt.toLocaleString()} sq ft × {money(estimator.ratePerSqFt)} × {multiplier}
            </span>
            <span>{money(paintingCost)}</span>
          </div>
          {estimator.designFee > 0 && (
            <div className="flex justify-between text-stone-500">
              <span>Design fee</span>
              <span>{money(estimator.designFee)}</span>
            </div>
          )}
          {estimator.travelFee > 0 && (
            <div className="flex justify-between text-stone-500">
              <span>Travel fee</span>
              <span>{money(estimator.travelFee)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between border-t border-stone-200 pt-1 font-medium">
            <span>Estimated total</span>
            <span>{money(total)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={addToBudget}
          className="self-start rounded bg-stone-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700"
        >
          Add as line items
        </button>
      </div>
    </details>
  );
}
