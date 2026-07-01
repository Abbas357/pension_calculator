import { ResultRow, ResultSectionHeader } from './ResultRow'
import { formatDateSpaced, formatDurationYMD } from '@/lib/pension/format'
import type { PensionResult } from '@/lib/pension/types'

export function ServiceDetailsSection({ service }: { service: PensionResult['service'] }) {
  return (
    <>
      <ResultSectionHeader>
        Service Details <span className="font-normal italic">(Year – Month – Day)</span>
      </ResultSectionHeader>
      <ResultRow label={service.dorOrDodLabel} value={formatDateSpaced(service.dorOrDod)} />
      <ResultRow label="Date of Birth" value={formatDateSpaced(service.dob)} striped />
      <ResultRow label="Age at Event" value={formatDurationYMD(service.ageAtEvent)} />
      <ResultRow label="Date of Appointment" value={formatDateSpaced(service.doa)} striped />
      <ResultRow
        label="Length of Service"
        value={formatDurationYMD(service.lengthOfService)}
      />
      {service.eolDeducted && (
        <ResultRow
          label="EOL Deducted"
          value={formatDurationYMD(service.eolDeducted)}
          striped
        />
      )}
      <ResultRow
        label="Qualifying Service"
        value={
          service.qualifyingServiceCapped
            ? `${service.qualifyingServiceYears} years (capped from ${service.qualifyingServiceRaw} years)`
            : `${service.qualifyingServiceYears} years`
        }
        striped={!service.eolDeducted}
      />
    </>
  )
}
