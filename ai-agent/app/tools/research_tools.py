import requests

from langchain_core.tools import tool


@tool
def search_wikipedia(query: str) -> str:
    """
    Search Wikipedia for factual information related to a topic,
    person, historical event, festival, or other notable subject.
    """

    try:
        search_url = "https://en.wikipedia.org/w/api.php"

        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "format": "json",
            "srlimit": 5
        }

        headers = {
            "User-Agent": "NewsDate-AI-Agent/1.0"
        }

        response = requests.get(
            search_url,
            params=params,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        results = data.get("query", {}).get("search", [])

        if not results:
            return "No Wikipedia results found."

        output = []

        for result in results:

            title = result.get("title", "")
            snippet = result.get("snippet", "")

            # Remove HTML tags from Wikipedia snippet
            from bs4 import BeautifulSoup

            clean_snippet = BeautifulSoup(
                snippet,
                "html.parser"
            ).get_text()

            output.append(
                f"TITLE: {title}\n"
                f"SUMMARY: {clean_snippet}"
            )

        return "\n\n".join(output)

    except Exception as e:
        return f"Wikipedia search failed: {str(e)}"


if __name__ == "__main__":

    result = search_wikipedia.invoke({
        "query": "Indian Independence Day"
    })

    print(result)