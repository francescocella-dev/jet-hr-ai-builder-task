import {
  ADDITIONAL_CONTRIBUTION_RATE,
  ADDITIONAL_CONTRIBUTION_THRESHOLD,
  SOCIAL_CONTRIBUTION_RATE,
} from './rules2026'

export function calculateOrdinaryContributions(grossAnnualSalary: number): number {
  return grossAnnualSalary * SOCIAL_CONTRIBUTION_RATE
}

export function calculateAdditionalContribution(grossAnnualSalary: number): number {
  return Math.max(0, grossAnnualSalary - ADDITIONAL_CONTRIBUTION_THRESHOLD) * ADDITIONAL_CONTRIBUTION_RATE
}

export function calculateSocialContributions(grossAnnualSalary: number) {
  const ordinaryContributions = calculateOrdinaryContributions(grossAnnualSalary)
  const additionalContribution = calculateAdditionalContribution(grossAnnualSalary)

  return {
    ordinaryContributions,
    additionalContribution,
    totalContributions: ordinaryContributions + additionalContribution,
  }
}
