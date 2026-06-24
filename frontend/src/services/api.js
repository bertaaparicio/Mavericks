async function parseResponse(response) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.error || "No se ha podido completar la operación.");
  }
  return result;
}

/** Agent 1: envia el CV al flux integrat de lectura, Groq, checklist i matching inicial. */
export async function analyzeCv(file, language, plan = "free") {
  const body = new FormData();
  body.append("cv", file);
  body.append("language", language);
  body.append("plan", plan);

  const response = await fetch("/api/analyze", { method: "POST", body });
  return parseResponse(response);
}

/** Agent 1 bis + Agent 2 provisional: reconsulta ofertes després de completar el perfil. */
export async function completeProfile(matchingProfile, answers, language = "ca", plan = "free") {
  const response = await fetch("/api/profile/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      matching_profile: matchingProfile,
      answers,
      language,
      plan,
    }),
  });
  return parseResponse(response);
}
