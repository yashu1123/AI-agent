from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import ToolMessage

from .research_tools import search_wikipedia


load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0
)

tools = [
    search_wikipedia
]

llm_with_tools = llm.bind_tools(tools)


def run_tool_agent(question: str):

    messages = [
        (
            "system",
            """
You are a research assistant.

You have access to a Wikipedia search tool.

Use the tool whenever you need factual information
that can be found on Wikipedia.

After receiving the tool result, provide a concise
and factual answer to the user's question.
"""
        ),
        (
            "human",
            question
        )
    ]

    # 1. Ask Gemini
    response = llm_with_tools.invoke(messages)

    print("\n===== GEMINI FIRST RESPONSE =====")
    print(response)

    # Add Gemini response to conversation
    messages.append(response)

    # 2. Check whether Gemini requested a tool
    if response.tool_calls:

        for tool_call in response.tool_calls:

            print("\n===== TOOL CALL =====")
            print(tool_call)

            tool_name = tool_call["name"]
            tool_args = tool_call["args"]

            # 3. Execute requested tool
            if tool_name == "search_wikipedia":

                tool_result = search_wikipedia.invoke(
                    tool_args
                )

                print("\n===== TOOL RESULT =====")
                print(tool_result)

                # 4. Send result back using ToolMessage
                messages.append(
                    ToolMessage(
                        content=tool_result,
                        tool_call_id=tool_call["id"]
                    )
                )

    # 5. Ask Gemini again using the tool result
    final_response = llm_with_tools.invoke(messages)

    print("\n===== FINAL AI RESPONSE =====")
    print(final_response.content)

    return final_response


if __name__ == "__main__":

    run_tool_agent(
        "What is the significance of August 15 in India?"
    )