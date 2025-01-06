### vector atlas data management script

----------------------------------------

This is a python script aimed at facilitating data uploading, and data downloading to the vector atlas platform database.


#### set up


1. create a virtual environment and activate it: ```python3.8 -m venv venv; source venv/bin/activate```
2. install all dependencies: ```pip install -r requirements.txt```
3. run the desired action (either upload or download)


#### to upload


```python3 main.py upload <file-path>```


#### to download

...


#### run api

```uvicorn api:app --reload```

