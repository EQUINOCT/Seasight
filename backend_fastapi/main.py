from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session
from datetime import datetime
import yaml
from google.cloud.sql.connector import Connector
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)

environment = os.getenv('ENVIRONMENT')

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_connection_pool(environment):
    """Initialize a connection pool to Cloud SQL."""
    
    db_params = config['db'][environment]

    def getconn():
        conn = connector.connect(
            db_params['host'],
            "pg8000",  # Python DB-API driver for PostgreSQL
            user=db_params['user'],
            password=db_params['password'],
            db=db_params['dbname']
        )
        return conn
    
    if environment == 'remote':
        # Initialize the connector
        connector = Connector()
        # Create connection pool
        pool = create_engine(
            "postgresql+pg8000://",
            creator=getconn,
            pool_size=5,
            max_overflow=2,
            pool_timeout=30,
            pool_recycle=1800
        )
        return pool
    
    else:

        db_url = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
        pool = create_engine(
            db_url,
            pool_size=5,
            max_overflow=2,
            pool_timeout=30,
            pool_recycle=1800
        )
        return pool

    
engine = init_connection_pool(environment=environment)

@app.get("/api/analytics/realtime-data")
def get_tidal_data():
    with engine.connect() as conn:
        sql_statement = text("""
            SELECT timestamp, tidal_level
            FROM (
            SELECT timestamp, tidal_level
            FROM ioc_observed
            ORDER BY timestamp DESC
            LIMIT 40
            ) AS subquery
            ORDER BY timestamp ASC;           
        """)
        # Fetch last 24 hours of data
        result = conn.execute(sql_statement)
        print(result)

        # Format data for the frontend

        return [{"timestamp": str(row[0]), "level": row[1]} for row in result]
    
@app.get("/api/current-level")
def get_current_level():
    with engine.connect() as conn:
        sql_statement = text("""
            SELECT timestamp, tidal_level 
            FROM ioc_observed
            ORDER BY timestamp DESC 
            LIMIT 1
        """)
        # Fetch last 24 hours of data
        result = conn.execute(sql_statement)
        current_level = result.fetchone()[1]

        # Format data for the frontend
        return {"level": current_level}
    
@app.get("/api/analytics/predicted-data")
def get_predicted_data():
    with engine.connect() as conn:
        sql_statement = text("""
            SELECT timestamp, tidal_level
            FROM soi_predicted
            ORDER BY timestamp DESC
            LIMIT 8
        """)

        result = conn.execute(sql_statement)
        return [{"timestamp": str(row[0]), "level": row[1]} for row in result]
    

@app.get("/api/analytics/historical-data")
def get_predicted_data():
    with engine.connect() as conn:
        sql_statement = text("""
            SELECT date_month, mean_level
            FROM monthly_averages
            ORDER BY date_month ASC
        """)

        result = conn.execute(sql_statement)
        return [{"timestamp": str(row[0]), "level": row[1]} for row in result]
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080)
