from datetime import datetime
from pydantic import BaseModel


class FileBase(BaseModel):
    file_path: str