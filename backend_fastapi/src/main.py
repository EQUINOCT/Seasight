from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import yaml
from google.cloud.sql.connector import Connector
import uvicorn
import os
from dotenv import load_dotenv
from sqlmodel import create_engine, select, and_
from sqlalchemy.exc import SQLAlchemyError
from typing import Annotated, Optional
from models import TimePeriodModel, RealTimeDataModel




load_dotenv()

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)

environment = os.getenv('ENVIRONMENT')

db_params = config['db'][environment]
db_url = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"

# connect_args = {"check_same_thread": False}
engine = create_engine(db_url)

def get_session():
    # try:
    # Attempt to create a session
    with Session(engine) as session:
        yield session
    
    # except SQLAlchemyError as e:
    #     raise HTTPException(
    #         status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
    #         detail="Could not connect to the database"
    #     )

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Default time period function
def get_default_time_period():
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)  # Default to last 7 days
    return start_date, end_date

@app.get("/api/analytics/realtime-data/by-date-range")
async def read_realtime_data(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=10000)] = 5000,
    start_date: Optional[datetime] = Query(default=None, description="Start date in ISO format"),
    end_date: Optional[datetime] = Query(default=None, description="End date in ISO format")
) -> list[RealTimeDataModel]:
    
    if not start_date or not end_date:
        default_start, default_end = get_default_time_period()
        start_date = start_date or default_start
        end_date = end_date or default_end

    query = select(RealTimeDataModel).where(
        and_(
            RealTimeDataModel.timestamp >= start_date,
            RealTimeDataModel.timestamp <= end_date
        )
    ).offset(offset).limit(limit)
    data = session.execute(query).scalars().all()
    return data
    
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
    


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
