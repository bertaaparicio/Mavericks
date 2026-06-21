/** Envia un currículum al backend Python y devuelve el análisis estructurado. */
export async function analyzeCv(file, language) {
  const body = new FormData();
  body.append("cv", file);
  body.append("language", language);

  const response = await fetch("/api/analyze", { method: "POST", body });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "No se ha podido analizar el documento.");
  return result;
}
