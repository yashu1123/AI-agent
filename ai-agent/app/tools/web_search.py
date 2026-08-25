from ddgs import DDGS

from langchain_core.tools import tool


@tool
def search_web(query: str) -> str:
    """
    Search the web for current information relevant to newspaper research.
    """

    try:
        results = []

        with DDGS() as ddgs:

            search_results = ddgs.text(
                query,
                max_results=5
            )

            for result in search_results:

                results.append(
                    f"TITLE: {result.get('title', '')}\n"
                    f"URL: {result.get('href', '')}\n"
                    f"SUMMARY: {result.get('body', '')}"
                )

        if not results:
            return "No web search results found."

        return "\n\n".join(results)

    except Exception as e:

        return f"Web search failed: {str(e)}"


if __name__ == "__main__":

    result = search_web.invoke({
        "query": "Karnataka latest news"
    })

    print(result)