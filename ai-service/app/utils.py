import json


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
            return json.loads(cleaned[start:end + 1])

        raise


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