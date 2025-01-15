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
def connect_to_db():
    # Database connection parameters
    db_params = config['db']

    try:
        # Establish a connection to the database
        connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
        engine = create_engine(connection_string)
        return engine
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
engine = connect_to_db()

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
    
# @app.get("/api/analytics/predicted-data")
# def get_predicted_data():
#     with engine.connect() as conn:
#         sql_statement = text("""
#             SELECT timestamp, tidal_level
#             FROM predicted
#             ORDER BY timestamp DESC
#             LIMIT 8
#         """)

#         result = conn.execute(sql_statement)
#         return [{"timestamp": str(row[0]), "level": row[1]} for row in result]
    

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