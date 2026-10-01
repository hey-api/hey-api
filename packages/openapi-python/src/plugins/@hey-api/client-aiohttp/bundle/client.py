from collections.abc import Callable, Iterator
from typing import Any, Generic, Optional, TypeVar
import httpx


T = TypeVar("T")

EXTRA_PREFIXES_MAP = {
    "$body_": "json",
    "$headers_": "headers",
    "$path_": "path",
    "$query_": "params",
}


def build_client_params(fields: list[dict[str, Any]], **kwargs) -> dict[str, Any]:
    """Build client parameters from flat keyword arguments.

    Args:
        fields: List of field configurations with 'in', 'key', and optional 'map'.
        **kwargs: Flat parameters passed to the SDK method.

    Returns:
        Dict suitable for httpx client methods: {params: {...}, headers: {...}, json: Any}
    """
    result: dict[str, Any] = {}

    key_map = {}
    for field in fields:
        key = field.get("key")
        if key:
            key_map[key] = {
                "in": field.get("in"),
                "map": field.get("map", key),
            }

    for key, value in kwargs.items():
        if value is None:
            continue

        field = key_map.get(key)

        if field:
            in_slot = field["in"]
            map_key = field["map"]
            slot = "json" if in_slot == "body" else in_slot

            if in_slot == "body":
                result[slot] = value
            else:
                if slot not in result:
                    result[slot] = {}
                result[slot][map_key] = value
        else:
            for prefix, slot in EXTRA_PREFIXES_MAP.items():
                if key.startswith(prefix):
                    actual_key = key[len(prefix) :]
                    if slot not in result:
                        result[slot] = {}
                    result[slot][actual_key] = value
                    break
            else:
                if "params" not in result:
                    result["params"] = {}
                result["params"][key] = value

    for slot in list(result.keys()):
        if not result[slot]:
            del result[slot]

    return result


class BaseClient:
    """Base HTTP client using httpx that SDK classes extend."""

    def __init__(self, client: Optional[httpx.Client] = None, base_url: Optional[str] = None, **kwargs):
        if client is not None:
            self._client = client
        else:
            self._client = httpx.Client(base_url=base_url or "", **kwargs)

    @property
    def client(self) -> httpx.Client:
        """Get the httpx client instance."""
        return self._client

    def request(self, method: str, url: str, **kwargs) -> httpx.Response:
        """Make an HTTP request."""
        return self._client.request(method, url, **kwargs)

    def get(self, url: str, **kwargs) -> httpx.Response:
        """Make a GET request."""
        return self._client.get(url, **kwargs)

    def post(self, url: str, **kwargs) -> httpx.Response:
        """Make a POST request."""
        return self._client.post(url, **kwargs)

    def put(self, url: str, **kwargs) -> httpx.Response:
        """Make a PUT request."""
        return self._client.put(url, **kwargs)

    def patch(self, url: str, **kwargs) -> httpx.Response:
        """Make a PATCH request."""
        return self._client.patch(url, **kwargs)

    def delete(self, url: str, **kwargs) -> httpx.Response:
        """Make a DELETE request."""
        return self._client.delete(url, **kwargs)

    def close(self):
        """Close the client."""
        self._client.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class Client(BaseClient):
    """HTTP client using httpx (alias for BaseClient)."""

    pass


def create_client(base_url: Optional[str] = None, **kwargs) -> Client:
    """Create a new HTTP client instance."""
    return Client(base_url=base_url, **kwargs)


class Page(Generic[T]):
    """One page of a list endpoint, and every page after it.

    Iterating a page yields its own items and then the items of each page that
    follows, requesting one page at a time:

        for widget in sdk.widgets.list():
            ...

    Read `items` instead to stay on this page.
    """

    def __init__(
        self,
        items: list[T],
        has_more: Optional[bool],
        fetch: Callable[..., "Page[T]"],
        kwargs: dict[str, Any],
        next_params: dict[str, Any],
    ):
        self.items = items
        self.has_more = has_more
        self._fetch = fetch
        self._kwargs = kwargs
        self._next_params = next_params

    def next_page(self) -> "Optional[Page[T]]":
        """The page after this one, or None when this is the last.

        A page follows when the response carried a value to ask for it. Some
        APIs report `has_more` and some leave it out, so it ends paging only
        when it says so, rather than when it is absent.
        """
        if self.has_more is False:
            return None
        if not any(value is not None for value in self._next_params.values()):
            return None
        return self._fetch(**self._kwargs, **self._next_params)

    def __iter__(self) -> Iterator[T]:
        page: Optional[Page[T]] = self
        seen: list[dict[str, Any]] = []
        while page is not None:
            yield from page.items
            if page._next_params in seen:
                raise RuntimeError(
                    f"The API asked for the same page twice ({page._next_params}) "
                    f"while still reporting more, so paging would not end."
                )
            seen.append(page._next_params)
            page = page.next_page()
