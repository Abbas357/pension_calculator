import { ServiceDetailsSection } from './ServiceDetailsSection'
import { EmolumentsSection } from './EmolumentsSection'
import { PensionCalculationSection } from './PensionCalculationSection'
import { AnnualIncreasesSection } from './AnnualIncreasesSection'
import { MedicalAllowanceSection } from './MedicalAllowanceSection'
import type { PensionResult } from '@/lib/pension/types'

/** The shared table body used by the on-screen results panel, the print report, and the PNG/PDF export capture. */
export function ResultsTable({ result }: { result: PensionResult }) {
  return (
    <table className="w-full border-collapse">
      <tbody>
        <ServiceDetailsSection service={result.service} />
        <EmolumentsSection emoluments={result.emoluments} />
        <PensionCalculationSection pensionCalc={result.pensionCalc} />
        <AnnualIncreasesSection
          increases={result.increases}
          netPensionBaselineLabel={result.netPensionBaselineLabel}
          netPensionBaselineAmount={result.netPensionBaselineAmount}
        />
        <MedicalAllowanceSection
          medical={result.medical}
          finalNetPensionPayable={result.finalNetPensionPayable}
        />
      </tbody>
    </table>
  )
}
