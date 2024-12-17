#!/usr/bin/env python3
import os
from datetime import datetime
import json

import requests
import boto3


def get_inverter_data():
    username = os.environ.get("USERNAME")
    password = os.environ.get("PASSWORD")
    login_url = "http://data.magnumenergy.com"
    current_timestamp_ms = int(datetime.now().timestamp() * 1000)
    data_url = f'http://data.magnumenergy.com/mw/jsonDay.php?station_id=MW6430&hours=24&_={current_timestamp_ms}'

    sess = requests.Session()
    sess.post(login_url, data={"username": username, "password": password})
    response = sess.get(data_url)
    return response.json()

def save_to_s3(data, key):
    session = boto3.Session()
    s3 = session.client('s3')
    data = json.dumps(data, indent=4, sort_keys=True)
    s3.put_object(Bucket='5040-hut-data.oram.ca', Key=key, Body=data)


def run():
    data = get_inverter_data()
    percentage_charged = data["b_state_of_charge"]
    print(f"Percentage charged: {percentage_charged}")
    now = datetime.now()
    save_to_s3(data, f"inverter_data/{now.year}-{now.month}-{now.day}/{now.year}-{now.month}-{now.day}T{now.hour}.json")
    return percentage_charged
