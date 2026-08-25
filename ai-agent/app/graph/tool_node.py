from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import ToolMessage

from app.tools.research_tools import search_wikipedia
from app.tools.web_search import search_web

load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0
)


tools = [
    search_wikipedia,
    search_web
]


llm_with_tools = llm.bind_tools(tools)


def run_research_agent(question: str):

    messages = [
        (
            "system",
            """
You are the research agent for a newspaper company.

You have access to research tools.

Use the available tools whenever factual information
is required.

After receiving tool results, provide a concise,
fact-based research result.
"""
        ),
        (
            "human",
            question
        )
    ]

    # First LLM call
    response = llm_with_tools.invoke(messages)

    # Add Gemini's response
    messages.append(response)

    # Execute requested tools
    if response.tool_calls:

        for tool_call in response.tool_calls:

            tool_name = tool_call["name"]
            tool_args = tool_call["args"]

            print(f"🔧 Tool selected: {tool_name}")
            print(f"📥 Arguments: {tool_args}")

            if tool_name == "search_wikipedia":

                tool_result = search_wikipedia.invoke(
                    tool_args
                    )
                print("📚 Wikipedia result received")
                messages.append(
                    ToolMessage(
                        content=tool_result,
                        tool_call_id=tool_call["id"]
                    )
                )
            elif tool_name == "search_web":
                tool_result = search_web.invoke(
                    tool_args
            )

            print("🔎 Web search result received")

            messages.append(
                ToolMessage(
                    content=tool_result,
                    tool_call_id=tool_call["id"]
                )
            )

    # Ask Gemini to process the tool result
    final_response = llm_with_tools.invoke(messages)

    return final_response.content