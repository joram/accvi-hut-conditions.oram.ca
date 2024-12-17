import json
import os

import boto3


def list_snowdepth_s3_files(bucket_name, prefix):
    s3 = boto3.client('s3')
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket_name, Prefix=prefix)

    files = []
    for page in pages:
        files.extend([content['Key'] for content in page.get('Contents', [])])
    files = [f for f in files if f.endswith('snow_depth.txt')]
    return files


def s3_file_content(bucket_name, key):
    s3 = boto3.client('s3')
    response = s3.get_object(Bucket=bucket_name, Key=key)
    return response['Body'].read().decode('utf-8')


def save_to_s3(data, key):
    session = boto3.Session()
    s3 = session.client('s3')
    s3.put_object(Bucket='5040-hut-data.oram.ca', Key=key, Body=json.dumps(data, indent=4))


def run():
    bucket_name = '5040-hut-data.oram.ca'
    summary_key = "snow_depth/summary.json"
    files = list_snowdepth_s3_files(bucket_name, "snow_depth/")

    data = {}
    try:
        content = s3_file_content(bucket_name, summary_key)
        data = json.loads(content)
    except Exception as e:
        print(f"Failed to load summary.json: {e}")
    if "files" not in data:
        data["files"] = []
    if "values" not in data:
        data["values"] = {}

    for file in files:
        if file not in data["files"]:
            content = s3_file_content(bucket_name, file)
            data["files"].append(file)
            filename = os.path.basename(file)
            parts = filename.split('_')
            key = parts[0]
            data["values"][key] = float(content)
    save_to_s3(data, summary_key)

    return data


