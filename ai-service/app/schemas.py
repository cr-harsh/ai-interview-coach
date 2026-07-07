from typing import List
from pydantic import BaseModel


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