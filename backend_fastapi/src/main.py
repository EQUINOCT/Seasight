from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import yaml
from google.cloud.sql.connector import Connector
import uvicorn
import os
import pandas as pd
from dotenv import load_dotenv
from sqlmodel import create_engine, select, and_, func
from sqlalchemy.exc import SQLAlchemyError
from typing import Annotated, Optional
from models import TimePeriodModel, RealTimeDataModel, PredictedDataModel




load_dotenv()
config_path = os.getenv('CONFIG_PATH')
with open(config_path, 'r') as file:
    config = yaml.safe_load(file)

environment = os.getenv('ENVIRONMENT')

# db_params = config['db'][environment]
# db_url = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"


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
# connect_args = {"check_same_thread": False}
# engine = create_engine(db_url)

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

@app.get("/api/analytics/predicted-data/by-date-range")
async def read_predicted_data(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=10000)] = 5000,
    start_date: Optional[datetime] = Query(default=None, description="Start date in ISO format"),
    end_date: Optional[datetime] = Query(default=None, description="End date in ISO format")
) -> list[PredictedDataModel]:
    
    if not start_date or not end_date:
        default_start, default_end = get_default_time_period()
        start_date = start_date or default_start
        end_date = end_date or default_end

    query = select(PredictedDataModel).where(
        and_(
            PredictedDataModel.timestamp >= start_date,
            PredictedDataModel.timestamp <= end_date
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
            WHERE tidal_level < 2.0
            ORDER BY timestamp DESC 
            LIMIT 1
        """)
        # Fetch latest data point
        result = conn.execute(sql_statement)
        current_level = result.fetchone()[1]

        # Format data for the frontend
        return current_level
    
@app.get("/api/map/realtime-data/by-date/max")
async def get_max_realtime_tidal_level_for_date(
    session: SessionDep,
    selected_date: Optional[datetime] = Query(default=None, description="Selected date in ISO format"),
) -> float:
    
    if not selected_date:
        selected_date = datetime.now()

    query = select(func.max(RealTimeDataModel.tidal_level)).where(
            func.date(RealTimeDataModel.timestamp) == func.date(selected_date),
            RealTimeDataModel.tidal_level < 2.0
            )
    date_max_level = session.execute(query).scalar()
    return date_max_level

@app.get("/api/map/predicted-data/by-date/max")
async def get_max_predicted_tidal_level_for_date(
    session: SessionDep,
    selected_date: Optional[datetime] = Query(default=None, description="Selected date in ISO format"),
) -> float:
    
    if not selected_date:
        selected_date = datetime.now()

    query = select(func.max(PredictedDataModel.tidal_level)).where(
            func.date(PredictedDataModel.timestamp) == func.date(selected_date),
            PredictedDataModel.tidal_level < 2.0
            )
    date_max_level = session.execute(query).scalar()
    print(date_max_level)
    return date_max_level
       

async def get_historical_data():
    with engine.connect() as conn:
        sql_statement = text("""
            SELECT date_month, mean_level
            FROM monthly_averages
            WHERE date_month >= '1950-01'
            ORDER BY date_month ASC
        """)

        result = conn.execute(sql_statement)
        df = pd.DataFrame(result.fetchall(), columns=result.keys())
        # return [{"timestamp": str(row[0]), "level": row[1]} for row in result]
        return df
    
@app.get("/api/analytics/historical-data/monthly-means")
async def get_monthly_means_historical():
    df = await get_historical_data()
    df.fillna(value='null', inplace=True)
    df.rename(columns=dict(date_month='timestamp',
                           mean_level='level'), 
                           inplace=True
                           )
    return df.to_dict(orient='records')
    # return data

@app.get("/api/analytics/historical-data/decadal-means")
async def get_monthly_means_historical():
    df = await get_historical_data()
    # Convert 'date_month' to datetime
    df['date_month'] = pd.to_datetime(df['date_month'])
    df['decade'] = (df['date_month'].dt.year // 10) * 10
    current_year = datetime.now().year
    df['decade'] = df['decade'].apply(lambda year: f"{year}-{year+9}" if year+9 < current_year else f"{year}-{current_year}")
    # Group by the decade and calculate the average for each group
    grouped_df = df.groupby('decade', as_index=False).agg({'mean_level': 'mean'})
    return grouped_df.to_dict(orient='records')
    


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
