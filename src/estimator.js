const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  let numberOfDays;
  if (data.periodType === 'days') {
    numberOfDays = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    numberOfDays = 7 * data.timeToElapse;
  }
  if (data.periodType === 'months') {
    numberOfDays = 30 * data.timeToElapse;
  }

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  const exponent = Math.trunc(numberOfDays / 3);

  const infections = impact.currentlyInfected * (2 ** exponent);
  const severeImpactInfections = severeImpact.currentlyInfected * (2 ** exponent);

  const severeCases = 0.15 * infections;
  const severeImpactCases = 0.15 * severeImpactInfections;

  const bedAvailability = 0.35 * data.totalHospitalBeds;

  impact.infectionsByRequestedTime = Math.trunc(impact.currentlyInfected * (2 ** exponent));
  severeImpact.infectionsByRequestedTime = Math.trunc(severeImpact.currentlyInfected * (2 ** exponent));

  impact.severeCasesByRequestedTime = Math.trunc(severeCases);
  severeImpact.severeCasesByRequestedTime = Math.trunc(severeImpactCases);

  impact.hospitalBedsByRequestedTime = Math.trunc(bedAvailability - severeCases);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(bedAvailability - severeImpactInfections);

  impact.casesForICUByRequestedTime = Math.trunc(0.05 * impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = Math.trunc(0.05 * severeImpact.infectionsByRequestedTime);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * impact.infectionsByRequestedTime);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * severeImpact.infectionsByRequestedTime);

  const majorityEarning = Number(data.region.avgDailyIncomePopulation);
  const avgDailyIncome = Number(data.region.avgDailyIncomeInUSD);
  const days = Number(numberOfDays);

  const dollarsInFlight = (impact.infectionsByRequestedTime * majorityEarning * avgDailyIncome) / days;
  const severeImpactDollarsInFlight = (severeImpact.infectionsByRequestedTime * majorityEarning * avgDailyIncome) / days;

  impact.dollarsInFlight = Math.trunc(dollarsInFlight);
  severeImpact.dollarsInFlight = Math.trunc(severeImpactDollarsInFlight);

  return {data, 
          impact, 
          severeImpact
         };
};

export default covid19ImpactEstimator;
