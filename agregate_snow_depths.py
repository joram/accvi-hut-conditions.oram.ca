import datetime

import boto3
import os


def list_snowdepth_s3_files(bucket_name, prefix):
    s3 = boto3.client('s3')
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket_name, Prefix=prefix)

    files = []
    for page in pages:
        files.extend([content['Key'] for content in page['Contents']])
    files = [f for f in files if f.endswith('snow_depth.txt')]
    return files


def cached_download_s3_file(bucket_name, key, local_path):
    if os.path.exists(local_path):
        with open(local_path, 'r') as f:
            return f.read()

    s3 = boto3.client('s3')
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    s3.download_file(bucket_name, key, local_path)
    with open(local_path, 'r') as f:
        return f.read()


def build_json():
    bucket_name = '5040-hut-data.oram.ca'
    prefix = 'webcam'
    files = list_snowdepth_s3_files(bucket_name, prefix)
    data = {}
    for file in files:
        content = cached_download_s3_file(bucket_name, file, f'./cache/{file}')
        depth = float(content)
        filename = os.path.basename(file)
        parts = filename.split('_')
        dt_str = parts[0]
        parts = dt_str.replace("T", "-").split('-')
        dt = datetime.datetime(int(parts[0]), int(parts[1]), int(parts[2]), int(parts[3]), int(parts[4]))
        data[dt.isoformat()] = depth
    return data


def save_to_s3(data, key):
    session = boto3.Session(profile_name='personal')
    s3 = session.client('s3')
    s3.put_object(Bucket='5040-hut-data.oram.ca', Key=key, Body=str(data))


if __name__ == "__main__":
    data = build_json()
    grouped_daily_snow_depths = {}
    daily_snow_depths = {}
    for k, v in data.items():
        date = k.split('T')[0]
        if date not in daily_snow_depths:
            daily_snow_depths[date] = []
        daily_snow_depths[date].append(v)
    for k, v in daily_snow_depths.items():
        l = len(v)
        third = int(l/3)
        v = v[third:2*third]
        grouped_daily_snow_depths[k] = sum(v) / len(v)
    print(grouped_daily_snow_depths)
    save_to_s3(grouped_daily_snow_depths, "snow_depths.json")