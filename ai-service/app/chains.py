from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.config import llm
from app.prompts import (
    question_prompt_template,
    evaluation_prompt_template,
    final_report_prompt_template,
)

parser = StrOutputParser()

question_chain = PromptTemplate.from_template(question_prompt_template) | llm | parser
evaluation_chain = PromptTemplate.from_template(evaluation_prompt_template) | llm | parser
final_report_chain = PromptTemplate.from_template(final_report_prompt_template) | llm | parser