import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

export async function exportPagesToPdf(
  pageEls: HTMLElement[],
  filename: string,
): Promise<void> {
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  for (let i = 0; i < pageEls.length; i++) {
    const el = pageEls[i];
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    const pxToPt = A4_WIDTH_PT / canvas.width;
    const imgHeightPt = canvas.height * pxToPt;

    if (i > 0) pdf.addPage();

    if (imgHeightPt <= A4_HEIGHT_PT) {
      pdf.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_PT, imgHeightPt);
    } else {
      // Content taller than one page: scale down to fit on a single page.
      const scaleDown = A4_HEIGHT_PT / imgHeightPt;
      const w = A4_WIDTH_PT * scaleDown;
      const h = A4_HEIGHT_PT;
      const xOffset = (A4_WIDTH_PT - w) / 2;
      pdf.addImage(imgData, "JPEG", xOffset, 0, w, h);
    }
  }

  pdf.save(filename);
}
