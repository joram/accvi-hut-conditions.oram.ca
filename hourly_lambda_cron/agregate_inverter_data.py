#!/usr/bin/env python3
import boto3
import os
import json


def list_inverter_data_s3_files(bucket_name):
    s3 = boto3.client('s3')
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket_name, Prefix="inverter_data")

    files = []
    for page in pages:
        files.extend([content['Key'] for content in page['Contents']])
    files = [f for f in files if f != "inverter_data/summary.json"]
    return files

def get_s3_file_content(bucket_name, key):
    s3 = boto3.client('s3')
    response = s3.get_object(Bucket=bucket_name, Key=key)
    return response['Body'].read().decode('utf-8')

def build_json():
    bucket_name = '5040-hut-data.oram.ca'
    files = list_inverter_data_s3_files(bucket_name)
    summary_key = "inverter_data/summary.json"

    data = {}
    try:
        content = get_s3_file_content(bucket_name, summary_key)
        data = json.loads(content)
    except Exception as e:
        print(f"Failed to load summary.json: {e}")
    if "files" not in data:
        data["files"] = []
    if "values" not in data:
        data["values"] = {}

    for file in files:
        if file not in data["files"]:
            content = get_s3_file_content(bucket_name, file)
            data["files"].append(file)
            key = os.path.basename(file)
            key = key.replace(".json", "")
            key = key.split("_")[0]
            battery_percent = json.loads(content)["b_state_of_charge"]
            data["values"][key] = float(battery_percent)
    return data

def save_to_s3(data, key):
    session = boto3.Session()
    s3 = session.client('s3')
    s3.put_object(Bucket='5040-hut-data.oram.ca', Key=key, Body=json.dumps(data, indent=4))


def run():
    data = build_json()
    print(data)
    save_to_s3(data, "inverter_data/summary.json")