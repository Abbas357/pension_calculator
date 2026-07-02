import type { Dispatch } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PensionTypeSelector } from "./PensionTypeSelector";
import { ProvinceSelector } from "./ProvinceSelector";
import { DatesSection } from "./DatesSection";
import { EolSection } from "./EolSection";
import { PaySection } from "./PaySection";
import { CommutationSlider } from "./CommutationSlider";
import { FormField, FormSection } from "./FormField";
import type { PensionFormAction } from "@/state/pensionFormReducer";
import type { PensionFormInput } from "@/lib/pension/types";

interface Props {
	form: PensionFormInput;
	dispatch: Dispatch<PensionFormAction>;
	payWarning?: string | null;
}

export function PensionForm({ form, dispatch, payWarning }: Props) {
	const setField = <K extends keyof PensionFormInput>(
		field: K,
		value: PensionFormInput[K],
	) => {
		dispatch({ type: "SET_FIELD", field, value });
	};

	return (
		<Card className="border-white/20 bg-white/40 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
			<CardHeader>
				<CardTitle className="text-lg">Pension Details</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<FormField label="Name of Pensioner" htmlFor="pname">
					<Input
						id="pname"
						maxLength={100}
						value={form.name}
						onChange={(e) => setField("name", e.target.value)}
						placeholder="Optional"
					/>
				</FormField>
				<FormSection title="Pension Type">
					<PensionTypeSelector
						value={form.ptype}
						onChange={(v) => setField("ptype", v)}
					/>
					<div className="mt-3">
						<ProvinceSelector
							value={form.govt}
							onChange={(v) => setField("govt", v)}
						/>
					</div>
				</FormSection>

				<DatesSection form={form} setField={setField} />
				<EolSection form={form} setField={setField} />
				<PaySection form={form} setField={setField} payWarning={payWarning} />
				<CommutationSlider form={form} setField={setField} />
			</CardContent>
		</Card>
	);
}
