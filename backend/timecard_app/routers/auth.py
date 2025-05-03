from datetime import datetime
from fastapi import APIRouter, HTTPException
from timecard_app.database import get_supabase_client
from timecard_app.schemas import UserCreate, UserOut

router = APIRouter()
supabase = get_supabase_client()

@router.post("/login")
def login(user: UserCreate):
    """
    Fetch user from Supabase without Auth0 token validation.
    
    Args:
        user (UserCreate): The user details to fetch.
    
    Returns:
        dict: The user details.
        
    Raises:
        HTTPException: If the user is not found.
    """
    
    response = supabase.table("users").select("*").eq("email", user.email).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data[0]



@router.post("/logout")
def logout():
    """Logout placeholder."""
    return {"message": "Logged out"}



@router.post("/register", response_model=UserOut)
def register(user: UserCreate):
    """
    Register a new user in Supabase without Auth0 token validation.
    
    Args:
        user (UserCreate): The user details to register.
        
    Returns:
        dict: The registered user details.
        
    Raises:
        HTTPException: If the registration
    """
    
    data = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "created_at": datetime.utcnow().isoformat()
    }
    response = supabase.table("users").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to register user")
    return data

