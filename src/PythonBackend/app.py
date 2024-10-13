from fastapi import FastAPI
from importer_exporter import DataUtil

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/export")
def export_data(filters):
    util = DataUtil()
    query: str = "Select * from user_role"
    data = util.get_data(query=query)
    print("Data:", data)
    return {"Data": "Exporting data"}

def build_sql(query_object: dict) -> str:    
    pass

# def app(environ, start_response):
#    data = b'Hello, Tutorialspoint!'
#    status = '200 OK'
#    response_headers = [
#       ('Content-type', 'text/plain'),
#       ('Content-Length', str(len(data)))
#    ]
#    start_response(status, response_headers)
#    return iter([data])