import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileImage, Printer, Loader2, Save, RotateCcw } from "lucide-react";
import { exportResultsAsPng } from "@/export/exportImage";
import { exportResultsAsPdf } from "@/export/exportPdf";
import { buildExportFilename } from "@/export/exportFilenames";
import { cn } from "@/lib/utils";
import type { PensionResult } from "@/lib/pension/types";

const EXPORT_NODE_ID = "pension-export-capture";

interface Props {
	result: PensionResult;
	onSave?: () => void;
	onReset?: () => void;
}

export function ExportActions({ result, onSave, onReset }: Props) {
	const [busy, setBusy] = useState<"png" | "pdf" | null>(null);

	const getExportNode = () => document.getElementById(EXPORT_NODE_ID);

	const handlePng = async () => {
		const node = getExportNode();
		if (!node) return;
		setBusy("png");
		try {
			await exportResultsAsPng(
				node,
				buildExportFilename("", result.service.dorOrDod, "png"),
			);
		} finally {
			setBusy(null);
		}
	};

	const handlePdf = async () => {
		const node = getExportNode();
		if (!node) return;
		setBusy("pdf");
		try {
			await exportResultsAsPdf(
				node,
				buildExportFilename("", result.service.dorOrDod, "pdf"),
			);
		} finally {
			setBusy(null);
		}
	};

	const buttonClass =
		"shrink-0 rounded-sm px-1.5 gap-1 text-[11px] leading-none whitespace-nowrap @sm:px-2.5 @sm:gap-1.5 @sm:text-sm text-white";
	const iconClass = "size-3.5 @sm:size-4";

	return (
		<div className="@container flex flex-nowrap items-center justify-center gap-1 overflow-x-auto @sm:gap-2">
			{onReset && (
				<Button
					size="lg"
					onClick={onReset}
					disabled={busy !== null}
					className={cn(buttonClass, "bg-amber-500 hover:bg-amber-600")}
				>
					<RotateCcw className={iconClass} />
					Reset
				</Button>
			)}

			{onSave && (
				<Button
					size="lg"
					onClick={onSave}
					disabled={busy !== null}
					className={cn(buttonClass, "bg-emerald-600 hover:bg-emerald-700")}
				>
					<Save className={iconClass} />
					Save
				</Button>
			)}

			<Button
				size="lg"
				onClick={handlePng}
				disabled={busy !== null}
				className={cn(buttonClass, "bg-blue-600 hover:bg-blue-700")}
			>
				{busy === "png" ? <Loader2 className={cn(iconClass, "animate-spin")} /> : <FileImage className={iconClass} />}
				Image
			</Button>

			<Button
				size="lg"
				onClick={handlePdf}
				disabled={busy !== null}
				className={cn(buttonClass, "bg-red-600 hover:bg-red-700")}
			>
				{busy === "pdf" ? <Loader2 className={cn(iconClass, "animate-spin")} /> : <FileText className={iconClass} />}
				PDF
			</Button>

			<Button
				size="lg"
				onClick={() => window.print()}
				disabled={busy !== null}
				className={cn(buttonClass, "bg-slate-700 hover:bg-slate-800")}
			>
				<Printer className={iconClass} />
				Print
			</Button>
		</div>
	);
}

export { EXPORT_NODE_ID };
