# import httpx
"""Module for application logic."""
from gen.python import OpenCode

# def log_request(request):
#     print(request.method, request.url, request.headers, request.content)

# client = httpx.Client(event_hooks={"request": [log_request]})

def run():
    """Implement run."""
    client = OpenCode()
    print(client)
    # client.tui.publish(
    #     body={
    #         "properties": {
    #             "message": "Hello from Hey API OpenAPI Python Playground!",
    #             "variant": "success",
    #         },
    #         "type": "tui.toast.show",
    #     },
    #     directory="main",
    # )

run()
