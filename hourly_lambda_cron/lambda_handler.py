# lambda_handler.py
import requests
from inverter_data import run as inverter_data_run
from agregate_inverter_data import run as agregate_inverter_data_run
from agregate_snow_depths import run as agregate_snow_depths_run
import os

SLACK_WEBHOOK_URL = os.environ.get("SLACK_WEBHOOK_URL")
def send_to_slack(msg):
    payload = {
        "text": f":hut::lightning: {msg}",
    }
    requests.post(SLACK_WEBHOOK_URL, json=payload)


def lambda_handler(event, context):
    percent_charged = inverter_data_run()
    agregate_inverter_data_run()
    agregate_snow_depths_run()
    send_to_slack(f"Hut batteries at {percent_charged}%")

    return {
        'statusCode': 200,
        'body': f"cron.py executed successfully!"
    }
