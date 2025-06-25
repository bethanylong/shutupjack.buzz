import asyncio

from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK

JACKS = set()


async def echo(websocket):
    async for message in websocket:
        if message == "jack":
            if websocket in JACKS:
                await websocket.send("Hi again Jack!");
            else:
                print("Added new Jack")
                JACKS.add(websocket)
                await websocket.send("Hi Jack!")
        elif message == "shut up":
            print(f"Telling {len(JACKS)} Jacks to shut up")
            closed_jacks = set()
            for jack in JACKS:
                try:
                    await jack.send("Please shut up")
                except ConnectionClosed:
                    # Jack is gone
                    closed_jacks.add(jack)
            for closed_jack in closed_jacks:
                print("Removed a Jack")
                JACKS.remove(closed_jack)
            plural = "" if len(JACKS) == 1 else "s"
            await websocket.send(f"Told {len(JACKS)} Jack{plural} to shut up")
        else:
            await websocket.send("I don't know what to do with you")


async def main():
    async with serve(echo, "localhost", 13017) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
