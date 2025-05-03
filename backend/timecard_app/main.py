from fastapi import FastAPI
from timecard_app.routers import auth, users, time_logs

app = FastAPI(title="Timecard App")

# Include routers with prefixes and tags for clarity
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(time_logs.router, prefix="/time_logs", tags=["time_logs"])

@app.get("/")
def read_root():
    # This is data that the front end processes and displays in a pretty way, 
    # but the data itself is just a dictionary with data like this
    return {"message": "Welcome to the Timecard App API!"} 