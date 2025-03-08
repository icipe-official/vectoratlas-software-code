
import csv
from datetime import timedelta, timezone, datetime
from enum import Enum
import os, json, time
from pathlib import Path
from typing import Annotated, List
from database.api.utils import walkpath_get_files

from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from database.api.schemas import FileBase
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware
from database.api import schemas
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from lib import align_data_old_to_new, excel_to_csv, store_uploaded_file, validate_authors 
from lib import load_data_from_csv, get_float_val, DELIMITER, validate_data
from lib import get_country_code_from_name, validate_coordinates


app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/validate/data/")
def validate_dataset(file: UploadFile = File(...)):
    errors = {}
    evaluation = False
    problematic_rows = 0
    exception = None
    if file:
        try:
            filepath = store_uploaded_file(file)
            evaluation, problematic_rows, errors, exception, errorsObj = validate_data(filepath)
        except Exception as e:
            print(e) 
            exception = e
        finally:
            file.file.close()
    return {
            "valid_data": True if evaluation else False,
            "problematic_rows": problematic_rows,
            "errors": errorsObj,
            "exception": exception
        }


@app.post("/upload/data/")
def upload_data(file: UploadFile = File(...)):
    errors = {}
    valid_data = False
    problematic_rows = 0
    load_status = False 
    exception = None
    if file:
        try:
            filepath = store_uploaded_file(file)
            basename = os.path.basename(filepath).split('.')[0]
            valid_data, problematic_rows, errors, exception, errorsObj = validate_data(filepath)
            if valid_data:
                print('Starting to load data into db')
                load_status = load_data_from_csv(f"data/temp/{basename}_aligned.csv")
                print('Finished loading data into db')
        except Exception as e:
            print("Upload python exception", e)
            exception = e
        finally:
            file.file.close()
    return  {
        "valid_data": valid_data,
        "problematic_rows": problematic_rows,
        "errors": errorsObj, 
        "exception": exception,
        "load_status": "success" if load_status else "failure"
    }
