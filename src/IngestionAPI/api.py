import csv
from datetime import timedelta, timezone, datetime
from enum import Enum
import os, json, time
from pathlib import Path
from typing import Annotated, List
from database.api.utils import walkpath_get_files

from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    status,
    File,
    UploadFile,
    WebSocket,
    Form,
    Body,
)
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
from lib import (
    align_data_old_to_new,
    excel_to_csv,
    store_uploaded_file,
    validate_authors,
)
from lib import (
    load_data_from_csv,
    load_data_from_csv_v2,
    get_float_val,
    DELIMITER,
    validate_data,
)
from lib import validate_coordinates

# from worker import celery
# import uuid

# from websocket_manager import manager
# from redis_listener import listen
import asyncio

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.post("/validate/data/v2/")
# async def validate_dataset_v2(file: UploadFile = File(...)):
#     file_id = str(uuid.uuid4())
#     filepath = store_uploaded_file(file)
#     task = validate_data.delay(filepath)
#     return {"task_id": task.id, "file_id": file_id}


@app.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    await manager.connect(task_id, websocket)

    # start redis listener
    asyncio.create_task(listen(task_id))
    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(task_id)


@app.post("/validate/data/")
def validate_dataset(file: UploadFile = File(...)):
    errors = {}
    errorsObj = {}
    evaluation = False
    problematic_rows = 0
    exception = None
    has_more_data = False
    if file:
        try:
            filepath = store_uploaded_file(file)
            (
                evaluation,
                problematic_rows,
                errors,
                exception,
                errorsObj,
                has_more_data,
                total_rows,
            ) = validate_data(filepath)
        except Exception as e:
            print(e)
            exception = e
        finally:
            file.file.close()
    return {
        "valid_data": True if evaluation else False,
        "problematic_rows": problematic_rows,
        "errors": errorsObj,
        "exception": exception,
        "has_more_data": has_more_data,
    }


@app.post("/validate/data/v2/")
def validate_dataset_v2(
    file: UploadFile = File(...),
    start_row: int = Form(...),
    chunk_size: int = Form(...),
):
    # return upload_data(file, [])
    errors = {}
    errorsObj = {}
    evaluation = False
    problematic_rows = 0
    exception = None
    has_more_data = False
    total_rows = 0

    if file:
        try:
            filepath = store_uploaded_file(file)
            (
                evaluation,
                problematic_rows,
                errors,
                exception,
                errorsObj,
                has_more_data,
                total_rows,
            ) = validate_data(filepath, start_row=start_row, chunk_size=chunk_size)
        except Exception as e:
            print(e)
            exception = e
        finally:
            file.file.close()
    return {
        "valid_data": True if evaluation else False,
        "problematic_rows": problematic_rows,
        "errors": errorsObj,
        "exception": exception,
        "has_more_data": has_more_data,
        "total_rows": total_rows,
    }


@app.post("/upload/data/")
def upload_data(
    file: UploadFile = File(...),
    # invalid_rows: str = Body(...),
    # uploaded_dataset_id: str = Body(...),
    invalid_rows: str = Form(...),
    uploaded_dataset_id: str = Form(...),
    start_row: int = Form(...),
    chunk_size: int = Form(...),
):
    errors = {}
    errorsObj = {}
    valid_data = False
    problematic_rows = 0
    load_status = False
    exception = None
    has_more_data = False
    total_ingested = 0

    # assume the dataset had been validated. This is true as the UI/API are enforcing this workflow.
    # This is better as it reduces timeouts since validate and ingestion are now separated
    assume_dataset_validated = True

    invalid_rows = [int(x) for x in (invalid_rows or "").split(",") if x]

    if file:
        try:
            filepath = store_uploaded_file(file)

            if not assume_dataset_validated:
                (
                    valid_data,
                    problematic_rows,
                    errors,
                    exception,
                    errorsObj,
                    has_more_data,
                    total_rows,
                ) = validate_data(filepath)
                if valid_data:
                    load_status = load_data_from_csv(
                        filepath,
                        invalid_rows=problematic_rows,
                        uploaded_dataset_id=uploaded_dataset_id,
                        start_row=start_row,
                        chunk_size=chunk_size,
                    )
            else:
                load_status = load_data_from_csv(
                    filepath,
                    invalid_rows=invalid_rows,
                    uploaded_dataset_id=uploaded_dataset_id,
                    start_row=start_row,
                    chunk_size=chunk_size,
                )

        except Exception as e:
            print("Upload python exception", e)
            exception = e
        finally:
            file.file.close()

    return {
        "valid_data": valid_data,
        "problematic_rows": problematic_rows,
        "errors": errorsObj,
        "exception": exception,
        "load_status": load_status,
    }


@app.post("/upload/data/v2")
def upload_data_v2(
    file: UploadFile = File(...),
    # invalid_rows: str = Body(...),
    # uploaded_dataset_id: str = Body(...),
    invalid_rows: str = Form(...),
    uploaded_dataset_id: str = Form(...),
    start_row: int = Form(...),
    chunk_size: int = Form(...),
):
    errors = {}
    errorsObj = {}
    valid_data = False
    problematic_rows = 0
    load_status = False
    exception = None
    has_more_data = False
    total_ingested = 0
    total_records = 0
    dataset_id = None

    print(f"Ingesting start row: {start_row}")

    # assume the dataset had been validated. This is true as the UI/API are enforcing this workflow.
    # This is better as it reduces timeouts since validate and ingestion are now separated
    assume_dataset_validated = True

    invalid_rows = [int(x) for x in (invalid_rows or "").split(",") if x]
    ingestion_error = None

    if file:
        try:
            filepath = store_uploaded_file(file)

            if not assume_dataset_validated:
                (
                    valid_data,
                    problematic_rows,
                    errors,
                    exception,
                    errorsObj,
                    has_more_data,
                    total_rows,
                ) = validate_data(filepath)
                if valid_data:
                    (
                        load_status,
                        total_ingested,
                        has_more_data,
                        ingestion_error,
                        total_records,
                        dataset_id,
                    ) = load_data_from_csv_v2(
                        filepath,
                        invalid_rows=problematic_rows,
                        uploaded_dataset_id=uploaded_dataset_id,
                    )
            else:
                (
                    load_status,
                    total_ingested,
                    has_more_data,
                    ingestion_error,
                    total_records,
                    dataset_id,
                ) = load_data_from_csv_v2(
                    filepath,
                    invalid_rows=invalid_rows,
                    uploaded_dataset_id=uploaded_dataset_id,
                    start_row=start_row,
                    chunk_size=chunk_size,
                )

        except Exception as e:
            print("Upload python exception", e)
            exception = e
        finally:
            file.file.close()

    return {
        "valid_data": valid_data,
        "problematic_rows": problematic_rows,
        "validation_errors": errorsObj,
        "ingestion_errors": ingestion_error,
        "exception": exception,
        "load_status": load_status,
        "has_more_data": has_more_data,
        "total_ingested": total_ingested,
        "total_rows": total_records,
        "dataset_id": dataset_id,
    }
