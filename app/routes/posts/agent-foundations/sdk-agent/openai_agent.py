from agents import Agent, Runner, function_tool


# 関数のシグネチャと docstring から Tool の定義 (名前、説明、引数の JSON Schema) を生成するアノテーション
@function_tool
def get_weather(city: str) -> str:
    """指定した都市の現在の天気を返す"""
    return f"{city} は晴れ、気温は 24 度"


agent = Agent(
    name="Weather agent",
    model="gpt-6-sol",
    instructions="あなたは天気を答えるアシスタントです。天気は必ず get_weather で調べてください。",
    tools=[get_weather],
)

result = Runner.run_sync(agent, "東京と大阪の天気を教えてください", max_turns=10)
print(result.final_output)
