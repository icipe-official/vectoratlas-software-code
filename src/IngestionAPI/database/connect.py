# -*- coding: utf-8 -*-

import psycopg2
from database import config
from dotenv import load_dotenv
from pathlib import Path
import os

def connect_OLD(config):
    """ Connect to the PostgreSQL database server """
    try:
        # connecting to the PostgreSQL server
        with psycopg2.connect(**config) as conn:
            print('Connected to the PostgreSQL server.')
            return conn
    except (psycopg2.DatabaseError, Exception) as error:
        print(error)

def get_connection_OLD():
    conn = connect_OLD(config.load_config())
    conn.autocommit = False
    return conn

if __name__ == '__main__':
    config_def = config.load_config()
    connect_OLD(config_def)


# conn = psycopg2.connect(
#     host="localhost",
#     database="suppliers",
#     user="YourUsername",
#     password="YourPassword"
# )

class Connection:
    def __init__(self) -> None:
        self.load_env()
        self.params = {
            "database": os.getenv("POSTGRES_DB"),
            "user": os.getenv("POSTGRES_USER"),
            "password": os.getenv("POSTGRES_PASSWORD"),
            "host": os.getenv("POSTGRES_HOST"),
            "port": os.getenv("POSTGRES_PORT")
        }

    def load_env(self) -> None:
        BASE_DIR: Path = Path(__file__).resolve().parent.parent
        load_dotenv(os.path.join(BASE_DIR, ".env"))

    def connect(self) -> psycopg2.extensions.connection:
        return psycopg2.connect(**self.params)
    
def get_connection():
    conn = Connection().connect()
    conn.autocommit = False
    return conn
    