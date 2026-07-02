import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileImage, Printer, Loader2, Save } from "lucide-react";
import { exportResultsAsPng } from "@/export/exportImage";
import { exportResultsAsPdf } from "@/export/exportPdf";
import { buildExportFilename } from "@/export/exportFilenames";
import type { PensionResult } from "@/lib/pension/types";

const EXPORT_NODE_ID = "pension-export-capture";

interface Props {
	result: PensionResult;
	onSave?: () => void;
}

export function ExportActions({ result, onSave }: Props) {
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

	return (
		<div className="flex flex-wrap justify-end gap-2">
			{onSave && (
				<Button
					size="lg"
					onClick={onSave}
					disabled={busy !== null}
					className="rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white"
				>
					<Save />
					Save
				</Button>
			)}

			<Button
				size="lg"
				onClick={handlePng}
				disabled={busy !== null}
				className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white"
			>
				{busy === "png" ? <Loader2 className="animate-spin" /> : <FileImage />}
				Image
			</Button>

			<Button
				size="lg"
				onClick={handlePdf}
				disabled={busy !== null}
				className="rounded-sm bg-red-600 hover:bg-red-700 text-white"
			>
				{busy === "pdf" ? <Loader2 className="animate-spin" /> : <Download />}
				PDF
			</Button>

			<Button
				size="lg"
				onClick={() => window.print()}
				disabled={busy !== null}
				className="rounded-sm bg-slate-700 hover:bg-slate-800 text-white"
			>
				<Printer />
				Print
			</Button>
		</div>
	);
}

export { EXPORT_NODE_ID };
