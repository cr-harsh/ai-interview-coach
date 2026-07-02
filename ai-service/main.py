import os
import json
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


load_dotenv()

app = FastAPI(title="AI Interview Coach - AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=GROQ_API_KEY,
    temperature=0.7
)


# -----------------
# Request Models
# -----------------

class QuestionRequest(BaseModel):
    domain: str
    difficulty: str
    questionNumber: int
    previousQuestions: List[str] = []


class AnswerRequest(BaseModel):
    domain: str
    difficulty: str
    question: str
    userAnswer: str


class ResponseItem(BaseModel):
    question: str
    userAnswer: str
    feedback: str
    score: float
    questionNumber: int


class ReportRequest(BaseModel):
    responses: List[ResponseItem]


# -----------------
# Prompt Templates
# -----------------

question_prompt_template = """
You are an expert technical interviewer conducting a structured 5-question interview session.

Your task is to generate ONE fresh interview question for the current step of the session.

Domain: {domain}
Difficulty Level: {difficulty}
Question Number in Session: {questionNumber}

Previously Asked Questions:
{previousQuestions}

Interview Flow:
- Question 1: Test core fundamentals and conceptual clarity.
- Question 2: Test practical implementation or real-world usage.
- Question 3: Test debugging, failure cases, or problem-solving.
- Question 4: Test optimization, trade-offs, or performance thinking.
- Question 5: Test advanced design, scalability, or decision-making.

Difficulty Rules:
Easy:
- Ask about basic definitions, simple comparisons, beginner tools, syntax, or foundational examples.

Medium:
- Ask about implementation steps, practical decisions, moderate trade-offs, debugging, and real-world usage.

Hard:
- Ask about deep reasoning, internal mechanics, mathematical intuition, advanced trade-offs, failure modes, optimization, deployment, scaling, or production challenges.
- Do NOT make every hard question a system design or architecture question.

Anti-Repetition Rules:
- Do NOT repeat any previously asked question.
- Do NOT slightly rephrase a previous question.
- Do NOT reuse the same main topic if it already appeared.
- Do NOT start multiple questions with the same phrase.

Output Rules:
- Output ONLY the question text.
- Ask only one question.
"""

evaluation_prompt_template = """
You are an expert AI Interview Coach. Evaluate the user's answer.

Domain: {domain}
Difficulty: {difficulty}
Question: {question}
User's Answer: {userAnswer}

Return ONLY valid JSON:
{{
  "score": <integer score between 0 and 100>,
  "feedback": "<general feedback>",
  "strengths": "<what was correct>",
  "weaknesses": "<what was missing or wrong>",
  "missingConcepts": "<important missing concepts>",
  "improvedAnswer": "<ideal answer>",
  "tips": "<future improvement tips>"
}}
"""

final_report_prompt_template = """
You are a senior technical hiring manager. Evaluate the complete interview.

Responses:
{responses_text}

Return ONLY valid JSON:
{{
  "finalReport": "<overall summary>",
  "overallStrengths": "<main strengths>",
  "weakAreas": "<main weak areas>",
  "recommendation": "<study plan>"
}}
"""


# -----------------
# Chains
# -----------------

parser = StrOutputParser()

question_chain = PromptTemplate.from_template(question_prompt_template) | llm | parser
evaluation_chain = PromptTemplate.from_template(evaluation_prompt_template) | llm | parser
final_report_chain = PromptTemplate.from_template(final_report_prompt_template) | llm | parser


# -----------------
# Helper Functions
# -----------------

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


# -----------------
# Routes
# -----------------

@app.get("/health")
def health_check():
    return {"status": "AI service running"}


@app.post("/generate-question")
async def generate_question(req: QuestionRequest):
    try:
        question = await question_chain.ainvoke({
            "domain": req.domain,
            "difficulty": req.difficulty,
            "questionNumber": req.questionNumber,
            "previousQuestions": "\n".join(req.previousQuestions)
        })

        return {"question": question.strip()}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Question generation failed: {str(e)}"
        )


@app.post("/evaluate-answer")
async def evaluate_answer(req: AnswerRequest):
    try:
        raw_output = await evaluation_chain.ainvoke({
            "domain": req.domain,
            "difficulty": req.difficulty,
            "question": req.question,
            "userAnswer": req.userAnswer
        })

        try:
            return parse_json_output(raw_output)

        except Exception:
            return {
                "score": 60,
                "feedback": raw_output,
                "strengths": "Answer submitted.",
                "weaknesses": "Could not parse structured JSON.",
                "missingConcepts": "N/A",
                "improvedAnswer": "N/A",
                "tips": "Try giving a more structured answer."
            }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Answer evaluation failed: {str(e)}"
        )


@app.post("/final-report")
async def final_report(req: ReportRequest):
    try:
        responses_text = ""

        for item in req.responses:
            responses_text += f"""
Question {item.questionNumber}: {item.question}
Candidate Answer: {item.userAnswer}
Feedback: {item.feedback}
Score: {item.score}/100
-------------------------
"""

        raw_output = await final_report_chain.ainvoke({
            "responses_text": responses_text
        })

        try:
            report = parse_json_output(raw_output)

        except Exception:
            report = {
                "finalReport": raw_output,
                "overallStrengths": "Session completed.",
                "weakAreas": "Could not parse structured JSON.",
                "recommendation": "Review each question individually."
            }

        return {
            "finalReport": make_text(report.get("finalReport")),
            "overallStrengths": make_text(report.get("overallStrengths")),
            "weakAreas": make_text(report.get("weakAreas")),
            "recommendation": make_text(report.get("recommendation")),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Final report generation failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)