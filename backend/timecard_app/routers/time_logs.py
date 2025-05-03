from fastapi import APIRouter, HTTPException, Depends
from fastapi import Body
from timecard_app.database import get_supabase_client
from timecard_app.schemas import TimeLogCreate, TimeLogOut
from datetime import datetime
import uuid

router = APIRouter()
supabase = get_supabase_client()

@router.post("/clock_in", response_model=TimeLogOut)
def clock_in(time_log: TimeLogCreate = Body(...)):
    """
    Clock in an employee by adding an entry to the database.
    
    Args:
        time_log (TimeLogCreate): The time log details to insert.
    
    Returns:
        dict: The inserted time log.
            
    Raises:
        HTTPException: If the insert fails.
    """

    user_check = supabase.table("users").select("*").eq("id", time_log.user_id).execute()
    if not user_check.data:
        raise HTTPException(status_code=404, detail="User not found")

    # TODO: Use pydantic model to validate input here, to log the error, before it hits the db.
    data = {
        "id": str(uuid.uuid4()),
        "user_id": time_log.user_id,
        "clock_in": datetime.utcnow().isoformat(), # TODO: This is the current time when the API is hit, but we should pass this in from the higher layer of code.
        "clock_out": None,
        "status": "normal",
        "created_at": datetime.utcnow().isoformat() # This is correct, as it's the time the record was created.
    }
    response = supabase.table("timecards").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to insert time log")
    return data



@router.post("/clock_out", response_model=TimeLogOut)
def clock_out(user_data: dict = Body(...)):
    """
    Clock out an employee by updating their latest time log.

    Args:
        user_id (str): The user ID to clock out.

    Returns:
        dict: The updated time log.

    Raises:
        HTTPException: If no active time log is found or if the update fails.
    """

    user_id = user_data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    response = supabase.table("timecards").select("*").eq("user_id", user_id).order("clock_in", desc=True).limit(1).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="No active time log found")

    latest_log = response.data[0]
    updated_data = {"clock_out": datetime.utcnow().isoformat()}

    update_response = supabase.table("timecards").update(updated_data).eq("id", latest_log["id"]).execute()

    return {**latest_log, **updated_data} 


@router.get("/history/{user_id}")
def get_user_time_logs(user_id: str):
    """
    Return all time logs for a specific user, ordered by clock_in descending.
    """
    response = supabase.table("timecards").select("*").eq("user_id", user_id).order("clock_in", desc=True).execute()

    if response.error:
        raise HTTPException(status_code=500, detail=f"Supabase error: {response.error.message}")

    return response.data




