import psycopg2
from dotenv import load_dotenv
import os 
from pathlib import Path
import csv
import base64
from datetime import datetime 

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
        BASE_DIR: Path = Path(__file__).resolve().parent
        load_dotenv(os.path.join(BASE_DIR, ".env"))

    def connect(self) -> psycopg2.extensions.connection:
        return psycopg2.connect(**self.params)


class DataHandler:
    def __init__(self, connection: Connection) -> None:
        self.connection = connection

    def get_data(self, query: str) -> tuple[list[tuple], list[tuple]]:
        with self.connection.connect() as conn:
            with conn.cursor() as cursor: 
                cursor.execute(query)
                return cursor.fetchall(), [col[0] for col in cursor.description]
            
    def export_to_csv(self, output_file: str, col_names: list[str], records: list[tuple]) -> None:
        # make images directory to export images to
        if not os.path.exists("images"):
            os.makedirs("images")
        
        with open(output_file, "w", newline="") as f:
            writer = csv.writer(f)
            col_names[-1] = "image_filename" # append image filename column
            writer.writerow(col_names) # Write headers
            for row in records:
                row = list(row) 
                file_name = self.save_image(row[-1])
                row[-1] = file_name

    def save_image(self, base64_img: bytes):
        """
        Save image to `images` directory 
        """
        file_name: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file_name: str = f"images/{file_name}" + ".png"
        base64_img: bytes = base64.b64encode(base64_img)
        img_data: bytes = base64.b64decode(base64_img)
        with open(file_name, "wb") as f:
            f.write(img_data)
        return file_name 
    
class DataUtil:
    def __init__(self) -> None:
        self.conn = Connection()
        self.handler = DataHandler(connection=self.conn)

    def export_to_csv(self, query: str) -> None:
        col_names, records = self.handler.get_data(query)
        self.handler.export_to_csv(query)

    def get_data(self, query: str) -> tuple[list[tuple], list[tuple]]:
        return self.handler.get_data(query)


