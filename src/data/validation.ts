export function normalizeCollar(code: string) { return code.trim().toUpperCase().replace(/\s/g, "") }
export function validCollar(code: string) { return /^PW-[A-Z0-9]{6}$/.test(normalizeCollar(code)) }
export function validMeasurement(value: string | number | undefined) {
  return value === "" || value === undefined || (Number.isFinite(Number(value)) && Number(value) > 0)
}
export function validBirthDate(value: string) {
  return !value || (/^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(new Date(value).getTime()) && value <= new Date().toISOString().slice(0,10))
}
export function ageFromDate(value: string) {
  const birth = new Date(value), today = new Date()
  const months = (today.getFullYear()-birth.getFullYear())*12 + today.getMonth()-birth.getMonth() - (today.getDate() < birth.getDate() ? 1 : 0)
  return months < 12 ? `${Math.max(0,months)} mois` : `${Math.floor(months/12)} an${months >= 24 ? "s" : ""}`
}
