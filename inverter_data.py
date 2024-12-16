#!/usr/bin/env python3
import os
from datetime import datetime

import requests
from dotenv import load_dotenv


def get_inverter_data():
    load_dotenv(".env")
    username = os.environ.get("USERNAME")
    password = os.environ.get("PASSWORD")
    login_url = "http://data.magnumenergy.com"
    current_timestamp_ms = int(datetime.now().timestamp() * 1000)
    data_url = f'http://data.magnumenergy.com/mw/jsonDay.php?station_id=MW6430&hours=24&_={current_timestamp_ms}'

    sess = requests.Session()
    sess.post(login_url, data={"username": username, "password": password})
    response = sess.get(data_url)
    return response.json()


if __name__ == "__main__":
    data = get_inverter_data()
    percentage_charged = data["b_state_of_charge"]
    print(f"Percentage charged: {percentage_charged}")
