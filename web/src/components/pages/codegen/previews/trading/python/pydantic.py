"""Module for application logic."""
from typing import Literal
from uuid import UUID

from pydantic import AwareDatetime, BaseModel


class Order(BaseModel):
    """Represent order."""

    id: UUID
    symbol: str
    side: Literal['buy', 'sell']
    type: Literal['market', 'limit', 'stop', 'stop_limit']
    quantity: float
    price: float | None = None
    status: Literal['pending', 'open', 'filled', 'partially_filled', 'cancelled', 'rejected']
    createdAt: AwareDatetime
