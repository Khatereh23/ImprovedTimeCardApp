import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Test output
print("SUPABASE_URL:", os.getenv("SUPABASE_URL"))
print("SUPABASE_KEY:", os.getenv("SUPABASE_KEY"))
