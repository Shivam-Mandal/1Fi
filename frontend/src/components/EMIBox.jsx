import React, { useMemo, useState, useEffect } from 'react';


const computeMonthlyEMI = (price, annualRatePercent, months) => {
  const monthlyRate = (annualRatePercent || 0) / 100 / 12;
  if (monthlyRate === 0) return +(price / months).toFixed(2);
  const r = monthlyRate;
  const emi = (price * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return +emi.toFixed(2);
};

export default function EMIBox({ price = 0, emiPlans = [] }) {
  const availablePlansRaw = Array.isArray(emiPlans) ? emiPlans : [];

  const ALLOWED_TENURES = useMemo(() => [3, 6, 9, 12], []);

  const availablePlans = useMemo(() => {
    return availablePlansRaw
      .filter(p => ALLOWED_TENURES.includes(Number(p.tenureMonths)))
      .map(p => ({ ...p, tenureMonths: Number(p.tenureMonths) })) 
      .sort((a, b) => a.tenureMonths - b.tenureMonths);
  }, [availablePlansRaw, ALLOWED_TENURES]);

  const dpOptions = useMemo(() => {
    return [
      Math.round(price * 0.15), 
      Math.round(price * 0.3),  
      0,                        
    ];
  }, [price]);

  const [downpayment, setDownpayment] = useState(dpOptions[0] ?? 0);
  const [selectedTenure, setSelectedTenure] = useState(availablePlans[0]?.tenureMonths ?? null);

  useEffect(() => {
    if (availablePlans.length) {
      const hasSelected = availablePlans.some(p => p.tenureMonths === selectedTenure);
      if (!hasSelected) {
        setSelectedTenure(availablePlans[0].tenureMonths);
      }
    } else {
      setSelectedTenure(null);
    }
  }, [availablePlansRaw.length]); 

  const adjustedPlans = useMemo(() => {
    const principal = Math.max(0, price - downpayment);
    return availablePlans.map(plan => {
      const adjustedMonthly = computeMonthlyEMI(principal, plan.interestRate, plan.tenureMonths);
      return {
        ...plan,
        adjustedMonthly,
      };
    });
  }, [availablePlans, price, downpayment]);

  const selectedPlan = adjustedPlans.find(p => p.tenureMonths === selectedTenure) || adjustedPlans[0] || null;

  return (
   <div className="bg-white rounded-lg border p-4 max-w-md mx-auto sm:p-6">
  <h4 className="font-medium mb-3 text-sm sm:text-base">Choose a Downpayment</h4>

  <div className="flex flex-wrap gap-3 mb-4">
    {dpOptions.map((dp, idx) => (
      <button
        key={idx}
        onClick={() => setDownpayment(dp)}
        className={`px-3 py-2 rounded-md border text-xs sm:text-sm ${
          downpayment === dp ? 'bg-emerald-900 text-white' : 'bg-white'
        }`}
      >
        {dp === 0 ? 'No downpayment' : `₹${dp.toLocaleString()}`}
      </button>
    ))}
    <div className="ml-auto text-xs sm:text-sm text-slate-600 self-center">
      <div>Downpayment</div>
      <div className="font-semibold">₹{downpayment.toLocaleString()}</div>
    </div>
  </div>

  <h4 className="font-medium mb-3 text-sm sm:text-base">Choose EMI Tenure</h4>

  {adjustedPlans.length === 0 ? (
    <div className="text-xs sm:text-sm text-slate-500">No EMI plans available.</div>
  ) : (
    <div className="space-y-3">
      {adjustedPlans.map(plan => (
        <label
          key={plan.tenureMonths}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md border"
        >
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <input
              type="radio"
              name="tenure"
              value={String(plan.tenureMonths)}
              checked={selectedTenure === plan.tenureMonths}
              onChange={() => setSelectedTenure(plan.tenureMonths)}
              className="h-4 w-4"
            />
            <div>
              <div className="text-xs sm:text-sm font-medium">
                ₹{plan.adjustedMonthly.toLocaleString()} x {plan.tenureMonths} months
              </div>
              <div className="text-xxs sm:text-xs text-slate-500">{plan.interestRate}% p.a.</div>
            </div>
          </div>

          <div className="text-xxs sm:text-xs text-slate-500">
            {plan.cashback ? `Cashback ₹${plan.cashback}` : ''}
          </div>
        </label>
      ))}
    </div>
  )}

  <div className="mt-4 border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
    <div>
      <div className="text-xxs sm:text-xs text-slate-500">EMI starting</div>
      <div className="text-sm sm:text-lg font-semibold text-emerald-900">
        {selectedPlan ? `₹${selectedPlan.adjustedMonthly.toLocaleString()}` : '—'}
      </div>
    </div>
    <button
      className="bg-emerald-900 text-white px-4 py-2 rounded-md shadow text-xs sm:text-sm"
      disabled={!selectedPlan}
    >
      {selectedPlan ? `Buy on ${selectedPlan.tenureMonths} months EMI` : 'Select a plan'}
    </button>
  </div>
</div>

  );
}
