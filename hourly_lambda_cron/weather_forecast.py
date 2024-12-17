#!/usr/bin/env python3
import json
from datetime import datetime

import boto3
import requests


def save_to_s3(data, key):
    session = boto3.Session()
    s3 = session.client('s3')
    s3.put_object(Bucket='5040-hut-data.oram.ca', Key=key, Body=json.dumps(data, indent=4))


def run():
    url = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=49.18916667&lon=-125.2875&altitude=1350"
    response = requests.get(url, headers={"User-Agent": "ACCVI-hut2"})
    if response.status_code != 200:
        print(response.text)
    data = response.json()

    now = datetime.now()
    save_to_s3(data, f"weather_forecast/{now.year}-{now.month}-{now.day}/{now.year}-{now.month}-{now.day}T{now.hour}.json")
    save_to_s3(data, f"weather_forecast/latest.json")


if __name__ == "__main__":
    run()