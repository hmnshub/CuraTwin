from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv
import os

# Import BOTH models now
from app.models.db_models import ChatHistory, User

async def init_db():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI")
    
    if not mongo_uri:
        raise ValueError("MONGO_URI is not set in environment variables. Check your .env file.")

    # 1. Initialize the async MongoDB client
    client = AsyncIOMotorClient(mongo_uri)
    
    # 2. Select the database
    database = client.curatwin_db
    
    # 3. Initialize Beanie models (Notice User is added here!)
    await init_beanie(database, document_models=[ChatHistory, User])
    
    print("Successfully connected to MongoDB Atlas and initialized Beanie models!")