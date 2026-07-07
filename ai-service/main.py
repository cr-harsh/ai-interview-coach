from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import QuestionRequest, AnswerRequest, ReportRequest
from app.chains import question_chain, evaluation_chain, final_report_chain
from app.utils import parse_json_output, make_text


app = FastAPI(title="AI Interview Coach - AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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