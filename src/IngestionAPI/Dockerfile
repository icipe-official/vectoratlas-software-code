FROM python:3.11.6-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

COPY . /code

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]