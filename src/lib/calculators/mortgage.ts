// ── Mortgage calculator utility — Phase 13 ───────────────────────────────────
// Bank-neutral estimation. Not a financing approval.

export interface MortgageInput {
  price: number;           // property price (OMR)
  downPaymentPct: number;  // e.g. 20 for 20%
  interestRatePct: number; // annual rate e.g. 4.5 for 4.5%
  periodYears: number;     // loan term in years
}

export interface MortgageResult {
  loanAmount: number;
  downPayment: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const downPayment = Math.round((input.price * input.downPaymentPct) / 100);
  const loanAmount = input.price - downPayment;
  const monthlyRate = input.interestRatePct / 100 / 12;
  const numPayments = input.periodYears * 12;

  let monthlyPayment = 0;
  if (loanAmount > 0) {
    if (monthlyRate > 0) {
      monthlyPayment = Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
      );
    } else {
      monthlyPayment = Math.round(loanAmount / numPayments);
    }
  }

  const totalRepayment = monthlyPayment * numPayments + downPayment;
  const totalInterest = Math.max(0, totalRepayment - input.price);

  return { loanAmount, downPayment, monthlyPayment, totalRepayment, totalInterest };
}
