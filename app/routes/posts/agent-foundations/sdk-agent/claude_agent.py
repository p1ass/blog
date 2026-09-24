import anyio
from claude_agent_sdk import (
    ClaudeAgentOptions,
    ClaudeSDKClient,
    ResultMessage,
    create_sdk_mcp_server,
    tool,
)


@tool("get_weather", "指定した都市の現在の天気を返す", {"city": str})
async def get_weather(args):
    return {"content": [{"type": "text", "text": f"{args['city']} は晴れ、気温は 24 度"}]}


weather = create_sdk_mcp_server(name="weather", version="1.0.0", tools=[get_weather])

options = ClaudeAgentOptions(
    model="sonnet",
    system_prompt="あなたは天気を答えるアシスタントです。天気は必ず get_weather で調べてください。",
    mcp_servers={"weather": weather},
    # 承認なしで実行する Tool の指定で、Bash や Read などの組み込み Tool も使える状態のまま
    allowed_tools=["mcp__weather__get_weather"],
    max_turns=10,
)


async def main():
    async with ClaudeSDKClient(options=options) as client:
        await client.query("東京と大阪の天気を教えてください")
        async for message in client.receive_response():
            if isinstance(message, ResultMessage):
                if message.subtype == "success":
                    print(message.result)
                else:
                    print(f"failed: {message.subtype}")


anyio.run(main)
