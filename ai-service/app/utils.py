import json
import re


def parse_json_output(text: str):
    cleaned = text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]

    if cleaned.startswith("```"):
        cleaned = cleaned[3:]

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start != -1 and end != -1:
            try:
                return json.loads(cleaned[start:end + 1])
            except Exception:
                pass

        raise


def extract_score(data) -> int:
    if isinstance(data, dict):
        for key in ["score", "Score", "rating", "Rating", "points", "Points"]:
            if key in data and data[key] is not None:
                val = data[key]
                if isinstance(val, (int, float)):
                    return int(max(0, min(100, val)))
                if isinstance(val, str):
                    match = re.search(r'\d+', val)
                    if match:
                        return int(max(0, min(100, int(match.group()))))
    elif isinstance(data, (int, float)):
        return int(max(0, min(100, data)))
    elif isinstance(data, str):
        match = re.search(r'\d+', data)
        if match:
            return int(max(0, min(100, int(match.group()))))
    return 70


def sanitize_evaluation(data, raw_output: str) -> dict:
    if not isinstance(data, dict):
        data = {}

    score = extract_score(data)

    feedback = (
        data.get("feedback") or
        data.get("Feedback") or
        data.get("overall_feedback") or
        data.get("comment") or
        data.get("strengths") or
        raw_output
    )

    return {
        "score": score,
        "feedback": make_text(feedback) or "Answer processed successfully.",
        "strengths": make_text(data.get("strengths") or "Good effort on answering."),
        "weaknesses": make_text(data.get("weaknesses") or "Could be elaborated further."),
        "missingConcepts": make_text(data.get("missingConcepts") or "N/A"),
        "improvedAnswer": make_text(data.get("improvedAnswer") or "N/A"),
        "tips": make_text(data.get("tips") or "Keep practicing core concepts.")
    }


def make_text(value):
    if value is None:
        return ""

    if isinstance(value, str):
        return value

    if isinstance(value, (int, float)):
        return str(value)

    if isinstance(value, list):
        return "\n".join(f"• {make_text(item)}" for item in value)

    if isinstance(value, dict):
        return "\n\n".join(
            f"{key}: {make_text(val)}"
            for key, val in value.items()
        )

    return str(value)