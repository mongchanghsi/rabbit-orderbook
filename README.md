# Orderbook

## Demo

[Demo](https://eric-rabbitx-orderbook.vercel.app/)

## Introduction

The Orderbook UI is a ReactJS application that provides a real-time view of buy and sell orders for a particular asset in a trading market. The order book is an essential component of any trading platform, offering traders a transparent view of market depth and price levels.

For this particular project, we limit to only BTC-USD, ETH-USD and SOL-USD. The data is coming from RabbitX and uses CentrifugeJS as websocket communication.

## Features

- Able to view bids and asks for a particular market
- Able to select available market for viewing

### Prerequisites

- RabbitX account for Websocket URL and the Public JWT token

### Steps

1. Clone the repository:
   ```
   git clone https://github.com/mongchanghsi/rabbit-orderbook.git
   cd rabbit-orderbook
   ```
2. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Copy a `.env`:

   ```
   cp .env.template .env
   ```

2. Within `.env`, insert in the relevant Websocket URL and the Public JWT token which can be retrieve from registering with RabbitX

3. Start the application:

   ```
   npm run start
   ```

## Improvements

1. Add live price chart
2. To add initial snapshot and subsequent snapshot if orderbook sequence number is not in sequence

## References

- [RabbitX Tech Documentation](https://docs.rabbitx.io/)
- [Centrifuge](https://github.com/centrifugal/centrifuge-js)
