const MONTHS_RU: Record<string, string> = {
  "01": "янв",
  "02": "фев",
  "03": "мар",
  "04": "апр",
  "05": "май",
  "06": "июн",
  "07": "июл",
  "08": "авг",
  "09": "сен",
  "10": "окт",
  "11": "ноя",
  "12": "дек",
};

export function formatDateRange(
  startDate: string,
  endDate: string | null | undefined,
  current: boolean,
): { label: string; duration: string } {
  const [sy, sm] = startDate.split("-");
  const startLabel = `${MONTHS_RU[sm]} ${sy}`;

  let endLabel: string;
  let endY: number;
  let endM: number;

  if (current || !endDate) {
    endLabel = "по настоящее время";
    const now = new Date();
    endY = now.getFullYear();
    endM = now.getMonth() + 1;
  } else {
    const [ey, em] = endDate.split("-");
    endLabel = `${MONTHS_RU[em]} ${ey}`;
    endY = Number(ey);
    endM = Number(em);
  }

  const startY = Number(sy);
  const startMn = Number(sm);
  const totalMonths = (endY - startY) * 12 + (endM - startMn) + 1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let duration = "";
  if (years > 0) duration += `${years} г. `;
  if (months > 0) duration += `${months} мес.`;
  if (!duration) duration = "< 1 мес.";

  return { label: `${startLabel} — ${endLabel}`, duration: duration.trim() };
}
