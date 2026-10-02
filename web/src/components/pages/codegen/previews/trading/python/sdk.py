"""Module for application logic."""
from client import Client, CreateOrderData

client = Client()

order, error = client.create_order(CreateOrderData(
    symbol='AAPL',
    side='buy',
    type='limit',
    quantity=10,
    price=189.50,
))

if error:
    print(f'Order failed: {error.message}')
else:
    print(f'Order placed: {order.id}')
