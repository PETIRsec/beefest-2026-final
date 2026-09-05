from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import os

app = FastAPI()

class UploadModel(BaseModel):
    filename: str
    content_b64: str

@app.post("/upload")
async def upload_file(data: UploadModel):
    try:
        content = base64.b64decode(data.content_b64)
        print(data.filename, flush=True)
        with open(data.filename, "wb") as f:
            f.write(content)
            
        return {"message": f"Successfully wrote {len(content)} bytes to {data.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Write failed.")

@app.get("/read")
async def read_file(filename: str):
    try:
        with open(filename, "rb") as f:
            content = f.read()
            
        return {
            "filename": filename, 
            "content_b64": base64.b64encode(content).decode('utf-8')
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found or unreadable.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, loop="uvloop")