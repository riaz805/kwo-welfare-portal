/**
 * Financial Calculation Engine for KWO
 * All monetary values handled as clean integers in PKR.
 */

export const processFundPayment = ({
  memberId,
  month,
  year,
  amountPaid,
  monthlyFee,
  previousArrears = 0
}) => {
  const paid = parseInt(amountPaid, 10) || 0;
  const fee = parseInt(monthlyFee, 10) || 1000;
  const prevArrears = parseInt(previousArrears, 10) || 0;

  let fundPortion = 0;
  let donationPortion = 0;
  let currentArrearsGenerated = 0;
  let arrearsPaid = 0;
  let remainingArrears = prevArrears;

  if (paid >= fee) {
    fundPortion = fee;
    const excess = paid - fee;
    
    // Excess amount pays off previous arrears first, then goes to donation
    if (prevArrears > 0) {
      if (excess >= prevArrears) {
        arrearsPaid = prevArrears;
        donationPortion = excess - prevArrears;
        remainingArrears = 0;
      } else {
        arrearsPaid = excess;
        remainingArrears = prevArrears - excess;
        donationPortion = 0;
      }
    } else {
      donationPortion = excess;
    }
  } else {
    // Paid amount is less than required fee
    fundPortion = paid;
    currentArrearsGenerated = fee - paid;
    remainingArrears = prevArrears + currentArrearsGenerated;
  }

  return {
    memberId,
    month,
    year,
    requiredAmount: fee,
    paidAmount: paid,
    fundPortion,
    donationPortion,
    currentArrearsGenerated,
    arrearsPaid,
    previousArrears: prevArrears,
    netRemainingArrears: remainingArrears,
    timestamp: new Date().toISOString()
  };
};

export const formatPKR = (amount) => {
  const num = parseInt(amount, 10) || 0;
  return new Intl.NumberFormat('ur-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
    .format(num)
    .replace('PKR', 'روپے');
};
