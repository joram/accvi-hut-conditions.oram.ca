import datetime
import json

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
    s3.put_object(Bucket='5040-hut-data.oram.ca', Key=key, Body=json.dumps(data, indent=4))

def remove_outliers(data):
    """
    Removes outliers from a list of numbers using the IQR method.

    :param data: List of numbers
    :return: List of numbers with outliers removed
    """
    if not data or len(data) < 3:
        print(f"Not enough data to determine outliers. {data}")
        return data

    # Sort the data
    sorted_data = sorted(data)

    # Calculate Q1 and Q3
    q1 = sorted_data[len(sorted_data) // 4]
    q3 = sorted_data[(3 * len(sorted_data)) // 4]

    # Calculate IQR
    iqr = q3 - q1

    # Determine lower and upper bounds
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr

    # Filter out outliers
    filtered_data = [x for x in data if lower_bound <= x <= upper_bound]

    return filtered_data


if __name__ == "__main__":
    data = build_json()
    grouped_daily_snow_depths = {}
    daily_snow_depths = {}
    for k, v in data.items():
        timestamp = datetime.datetime.strptime(k, "%Y-%m-%dT%H:%M:%S")
        date = timestamp.date()
        morning_start = datetime.datetime(date.year, date.month, date.day, 9)
        morning_end = datetime.datetime(date.year, date.month, date.day, 11, 30)
        afternoon_start = datetime.datetime(date.year, date.month, date.day, 12)
        afternoon_end = datetime.datetime(date.year, date.month, date.day, 16, 30)

        key = None
        if morning_start <= timestamp < morning_end:
            key = datetime.datetime(date.year, date.month, date.day, 9).strftime("%Y-%m-%d %H%p")
        elif afternoon_start <= timestamp < afternoon_end:
            key = datetime.datetime(date.year, date.month, date.day, 15).strftime("%Y-%m-%d %H%p")

        if key not in daily_snow_depths:
            daily_snow_depths[key] = []
        daily_snow_depths[key].append(v)
    for k, v in daily_snow_depths.items():
        good_values = v
        grouped_daily_snow_depths[k] = sum(good_values) / len(good_values)

    keys = list(grouped_daily_snow_depths.keys())
    smoothing_keys = [k for k in keys if k is not None]
    smoothing_keys.sort()
    for index, key in enumerate(keys):
        if index == 0 or index >= len(smoothing_keys) - 2:
            continue
        previous_key = smoothing_keys[index - 1]
        next_key = smoothing_keys[index + 1]
        previous_value = grouped_daily_snow_depths[previous_key]
        next_value = grouped_daily_snow_depths[next_key]
        neighbour_avg = (previous_value + next_value) / 2
        current_value = grouped_daily_snow_depths[key]
        similarity_of_neighbours = abs(previous_value - next_value) / max(previous_value, next_value)
        similarity_to_previous = abs(previous_value - current_value) / max(previous_value, current_value)
        similarity_to_next = abs(next_value - current_value) / max(next_value, current_value)
        avg_similarity_to_neighbours = (similarity_to_previous + similarity_to_next) / 2
        print(f"Neighbour similarity: {similarity_of_neighbours}")
        print(f"Current similarity: {avg_similarity_to_neighbours}")
        if similarity_of_neighbours > avg_similarity_to_neighbours:
            grouped_daily_snow_depths[key] = neighbour_avg
        else:
            grouped_daily_snow_depths[key] = current_value



    print(grouped_daily_snow_depths)
    save_to_s3(grouped_daily_snow_depths, "snow_depths.json")