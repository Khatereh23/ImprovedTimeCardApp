from supabase import create_client, Client
from timecard_app.config import SUPABASE_URL, SUPABASE_KEY

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client() -> Client:
    """Returns the Supabase client instance."""
    return supabase