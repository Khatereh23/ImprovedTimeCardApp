from fastapi import APIRouter, HTTPException
from timecard_app.database import get_supabase_client
from timecard_app.schemas import UserOut, UserUpdate

router = APIRouter()
supabase = get_supabase_client()

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str):
    """
    Fetch a user by ID from Supabase.
    """
    response = supabase.table("users").select("*").eq("id", user_id).execute()

    # Handle Supabase errors first
    if response.error:
        raise HTTPException(status_code=500, detail=f"Supabase error: {response.error.message}")

    # If no user was found
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Return the first matching user
    return response.data[0]

@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: str, user: UserUpdate):
    """
    Update a user by ID in Supabase.

    Args:
        user_id (str): The user ID to update.
        user (UserUpdate): The updated user details.

    Returns:
        dict: The updated user details.
    """
    update_data = user.dict(exclude_unset=True)
    response = supabase.table("users").update(update_data).eq("id", user_id).execute()

    if response.error:
        raise HTTPException(status_code=500, detail=f"Supabase error: {response.error.message}")

    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to update user")

    return response.data[0]
