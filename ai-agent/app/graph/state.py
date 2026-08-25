from typing import TypedDict, Annotated
import operator


class NewsState(TypedDict):

    date: str

    research_plan: str

    categories: dict

    events: Annotated[list, operator.add]

    final_response: str