import boto3
import json


INTERESTING_KEYS = ['Datetime', 'BarTrend', 'Barometer', 'TempIn', 'HumIn', 'TempOut', 'WindSpeed', 'WindSpeed10Min', 'WindDir', 'HumOut', 'RainRate', 'UV', 'SolarRad', 'RainStorm', 'StormStartDate', 'RainDay', 'RainMonth', 'RainYear', 'ETDay', 'ETMonth', 'ETYear', 'BatteryStatus', 'BatteryVolts', 'ForecastIcon', 'ForecastRuleNo', 'SunRise', 'SunSet']

def list_all_s3_keys():
    s3 = boto3.client('s3')
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket='5040-hut-barometer.oram.ca', Prefix="weather_station")
    files = []
    for page in pages:
        files.extend([content['Key'] for content in page['Contents']])
    files = [f for f in files if f != "weather_station/summary.json"]
    return files

def get_current_summary():
    s3 = boto3.client('s3')
    try:
        response = s3.get_object(Bucket='5040-hut-barometer.oram.ca', Key="weather_station/summary.json")
        return json.loads(response['Body'].read().decode('utf-8'))
    except:
        return {}

def write_current_summary(data):
    s3 = boto3.client('s3')
    s3.put_object(Bucket='5040-hut-barometer.oram.ca', Key="weather_station/summary.json", Body=json.dumps(data, indent=4))

def get_s3_file_content(key):
    s3 = boto3.client('s3')
    response = s3.get_object(Bucket='5040-hut-barometer.oram.ca', Key=key)
    content = response['Body'].read().decode('utf-8')
    content = content.replace('\'', '"')
    return json.loads(content)

def run():
    files = list_all_s3_keys()
    summary = get_current_summary()
    if 'values' not in summary:
        summary['values'] = {}
    if 'files' not in summary:
        summary['files'] = []

    for file in files:
        if file in summary.get('files', []):
            continue
        content = get_s3_file_content(file)

        files_interesting_data = {}
        for key in INTERESTING_KEYS:
            if key in content:
                files_interesting_data[key] = content[key]

        key = file.split('/')[-1].split('_')[0]
        key = key.replace('.json', '')
        summary['values'][key] = files_interesting_data
        summary['files'].append(file)
    write_current_summary(summary)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }