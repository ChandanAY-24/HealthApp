from app.main import app

# Top-level entrypoint for uvicorn: backend.main:app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
