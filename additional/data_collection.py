# -*- coding: utf-8 -*-
"""
This code, when run generates a text file called 'data.txt' with the current price of APT/USD in each new line,
where it appends new price every minute. This is used to collect data for the price of APT/USD for the past 24 hours.
"""
import requests
import schedule
import time


def getBinance():
    current_price = 0
    response = requests.get(
        "https://www.binance.com/api/v3/ticker/price?symbol=APTUSDT"
    )
    json_data = response.json()
    current_price += float(json_data["price"])
    return current_price


def getBitfinex():
    current_price = 0
    response = requests.get("https://api-pub.bitfinex.com/v2/tickers?symbols=tAPTUSD")
    json_data = response.json()
    current_price += (
        float(json_data[0][1]) + float(json_data[0][3]) + float(json_data[0][7])
    )
    return current_price / 3


def getCoinbase():
    current_price = 0
    response = requests.get("https://api.coinbase.com/v2/prices/APT-USD/spot")
    json_data = response.json()
    current_price += float(json_data["data"]["amount"])
    return current_price


def getHuobi():
    current_price = 0
    response = requests.get("https://api.huobi.pro/market/detail/merged?symbol=aptusdt")
    json_data = response.json()
    current_price += float(json_data["tick"]["bid"][0]) + float(
        json_data["tick"]["ask"][0]
    )
    return current_price / 2


def getMexc():
    current_price = 0
    response = requests.get(
        "https://www.mexc.com/open/api/v2/market/ticker?symbol=APT_USDT"
    )
    json_data = response.json()
    current_price += (
        float(json_data["data"][0]["ask"])
        + float(json_data["data"][0]["bid"])
        + float(json_data["data"][0]["last"])
    )
    return current_price / 3


def append_number_to_textfile(number, output_file):
    try:
        with open(output_file, "a") as file:
            file.write("\n" + str(number))
        print(f"Number {number} successfully appended to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")


def getAllData():
    price = getBinance() + getBitfinex() + getCoinbase() + getHuobi()
    price = price / 4
    append_number_to_textfile(price, "data.txt")


schedule.every(1).minutes.do(getAllData)

while True:
    schedule.run_pending()
    time.sleep(1)
