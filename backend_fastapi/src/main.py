from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session
from datetime import datetime
import yaml

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
engine = create_engine(f"sqlite:///{config['db']['url']}")

# Assuming your table structure is something like:
# CREATE TABLE tidal_levels (
#     timestamp DATETIME,
#     level FLOAT
# )

@app.get("/api/tidal-levels")
def get_tidal_data():
    with engine.connect() as conn:
        sql_statement = text("""
            SELECT timestamp, tidal_level 
            FROM psmsl 
            ORDER BY timestamp DESC 
            LIMIT 24
        """)
        # Fetch last 24 hours of data
        result = conn.execute(sql_statement)

        # Format data for the frontend
        return [{"timestamp": str(row[0]), "level": row[1]} for row in result]
    
@app.get("/api/current-level")
def get_tidal_data():
    with engine.connect() as conn:
        sql_statement = text("""
            SELECT timestamp, tidal_level 
            FROM psmsl 
            ORDER BY timestamp DESC 
            LIMIT 1
        """)
        # Fetch last 24 hours of data
        result = conn.execute(sql_statement)
        current_level = result.fetchone()[1]

        # Format data for the frontend
        return {"level": current_level}
    
