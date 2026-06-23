async function parseResponse(response) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.error || "No se ha podido completar la operación.");
  }
  return result;
}

/** Envia el CV al flux integrat: Groq, checklist i PostgreSQL. */
export async function analyzeCv(file, language, plan = "free") {
  const body = new FormData();
  body.append("cv", file);
  body.append("language", language);
  body.append("plan", plan);

  const response = await fetch("/api/analyze", { method: "POST", body });
  return parseResponse(response);
}

/** Torna a consultar les ofertes després de completar el perfil. */
export async function completeProfile(matchingProfile, answers) {
  const response = await fetch("/api/profile/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      matching_profile: matchingProfile,
      answers,
    }),
  });
  return parseResponse(response);
}
