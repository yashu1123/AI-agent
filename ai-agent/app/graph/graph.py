from langgraph.graph import StateGraph, START, END

from .state import NewsState
from .nodes import (
    analyze_date,
    generate_initial_response,
)


def build_graph():

    graph = StateGraph(NewsState)

    graph.add_node(
        "analyze_date",
        analyze_date
    )

    graph.add_node(
        "generate_response",
        generate_initial_response
    )

    graph.add_edge(
        START,
        "analyze_date"
    )

    graph.add_edge(
        "analyze_date",
        "generate_response"
    )

    graph.add_edge(
        "generate_response",
        END
    )

    return graph.compile()