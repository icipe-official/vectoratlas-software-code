# -*- coding: utf-8 -*-

import psycopg2
from database import config

def connect(config):
    """ Connect to the PostgreSQL database server """
    try:
        # connecting to the PostgreSQL server
        with psycopg2.connect(**config) as conn:
            print('Connected to the PostgreSQL server.')
            return conn
    except (psycopg2.DatabaseError, Exception) as error:
        print(error)

def get_connection():
    conn = connect(config.load_config())
    conn.autocommit = False
    return conn

if __name__ == '__main__':
    config_def = config.load_config()
    connect(config_def)


# conn = psycopg2.connect(
#     host="localhost",
#     database="suppliers",
#     user="YourUsername",
#     password="YourPassword"
# )