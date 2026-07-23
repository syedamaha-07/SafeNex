from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SafeNex API"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    SUPABASE_URL: str
    SUPABASE_KEY: str
    DATABASE_URL: str  # PostgreSQL connection string
    SUPABASE_SERVICE_ROLE_KEY: str
    
    # SECURITY
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
