from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI

from .state import NewsState

load_dotenv()


class ResearchDecision(BaseModel):
    india: bool = Field(description="Research important events in India")
    karnataka: bool = Field(description="Research events specifically in Karnataka")
    international: bool = Field(description="Research important international events")
    birthdays: bool = Field(description="Research notable celebrity and famous-person birthdays")
    history: bool = Field(description="Research historical events that happened on this date")
    festivals: bool = Field(description="Research festivals and observances")
    sports: bool = Field(description="Research important sports events")
    entertainment: bool = Field(description="Research entertainment events")


llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0
)

structured_llm = llm.with_structured_output(ResearchDecision)


def analyze_date(state: NewsState):

    date = state["date"]

    prompt = f"""
You are the planning agent for a newspaper intelligence system.

The newspaper wants to prepare content for:

DATE: {date}

Decide which research categories are relevant for this date.

Categories:

- India
- Karnataka
- International
- Celebrity birthdays
- Historical events
- Festivals and observances
- Sports
- Entertainment

Return TRUE if that category should be researched.
Return FALSE if it is not relevant.

Your job is ONLY to decide what categories the research agent should investigate.
"""

    decision = structured_llm.invoke(prompt)

    categories = decision.model_dump()

    return {
        "categories": categories,
        "research_plan": "Research categories selected by AI"
    }


def generate_initial_response(state: NewsState):

    date = state["date"]
    categories = state["categories"]

    print("🔥 NEW generate_initial_response IS RUNNING")
    print("CATEGORIES:", categories)

    selected = [
        category
        for category, enabled in categories.items()
        if enabled
    ]

    return {
        "final_response": (
            f"Date: {date}\n\n"
            f"AI selected research categories:\n"
            + "\n".join(f"- {category}" for category in selected)
        )
    }



def research_india(state: NewsState):
    print("🇮🇳 India research tool executed")

    return {
        "events": state["events"] + [
            {
                "category": "india",
                "message": f"Research India events for {state['date']}"
            }
        ]
    }


def research_karnataka(state: NewsState):
    print("🟢 Karnataka research tool executed")

    return {
        "events": state["events"] + [
            {
                "category": "karnataka",
                "message": f"Research Karnataka events for {state['date']}"
            }
        ]
    }


def research_birthdays(state: NewsState):
    print("🎂 Birthday research tool executed")

    return {
        "events": state["events"] + [
            {
                "category": "birthdays",
                "message": f"Research celebrity birthdays for {state['date']}"
            }
        ]
    }


def research_history(state: NewsState):
    print("📜 History research tool executed")

    return {
        "events": state["events"] + [
            {
                "category": "history",
                "message": f"Research historical events for {state['date']}"
            }
        ]
    }


def research_festivals(state: NewsState):
    print("🎉 Festival research tool executed")

    return {
        "events": state["events"] + [
            {
                "category": "festivals",
                "message": f"Research festivals for {state['date']}"
            }
        ]
    }


def research_sports(state: NewsState):
    print("🏏 Sports research tool executed")

    return {
        "events": state["events"] + [
            {
                "category": "sports",
                "message": f"Research sports events for {state['date']}"
            }
        ]
    }


def research_entertainment(state: NewsState):
    print("🎬 Entertainment research tool executed")

    return {
        "events": state["events"] + [
            {
                "category": "entertainment",
                "message": f"Research entertainment events for {state['date']}"
            }
        ]
    }


def research_international(state: NewsState):
    print("🌎 International research tool executed")

    return {
        "events": state["events"] + [
            {
                "category": "international",
                "message": f"Research international events for {state['date']}"
            }
        ]
    }



from .tool_node import run_research_agent


def research_with_tools(state: NewsState):

    date = state["date"]
    categories = state["categories"]

    selected_categories = [
        category
        for category, enabled in categories.items()
        if enabled
    ]

    print("🧠 Selected categories:", selected_categories)

    question = f"""
You are the research agent for a newspaper company.

Research information for:

DATE: {date}

The planner selected these categories:

{", ".join(selected_categories)}

Research ONLY the selected categories.

For each relevant category, find factual information
that could be useful to a newspaper.

Important requirements:

- Do not invent facts.
- Use the available research tools when necessary.
- Prefer factual and verifiable information.
- Return the findings clearly.
"""

    result = run_research_agent(question)

    return {
        "events": [
            {
                "category": "research",
                "message": result
            }
        ]
    }





def generate_newspaper_report(state: NewsState):

    date = state["date"]
    events = state.get("events", [])

    sections = {
        "india": [],
        "karnataka": [],
        "international": [],
        "birthdays": [],
        "history": [],
        "festivals": [],
        "sports": [],
        "entertainment": []
    }

    # Organize collected research by category
    for event in events:

        category = event.get("category", "india")
        message = event.get("message", "")

        if category in sections:
            sections[category].append(message)

    report = f"""
📰 NEWSDATE DAILY REPORT
Date: {date}

🇮🇳 INDIA
{chr(10).join(sections["india"]) or "No information collected."}

🟢 KARNATAKA
{chr(10).join(sections["karnataka"]) or "No information collected."}

🌎 INTERNATIONAL
{chr(10).join(sections["international"]) or "No information collected."}

🎂 BIRTHDAYS
{chr(10).join(sections["birthdays"]) or "No information collected."}

📜 ON THIS DAY
{chr(10).join(sections["history"]) or "No information collected."}

🎉 FESTIVALS & OBSERVANCES
{chr(10).join(sections["festivals"]) or "No information collected."}

🏏 SPORTS
{chr(10).join(sections["sports"]) or "No information collected."}

🎬 ENTERTAINMENT
{chr(10).join(sections["entertainment"]) or "No information collected."}
"""

    return {
        "final_response": report.strip()
    }