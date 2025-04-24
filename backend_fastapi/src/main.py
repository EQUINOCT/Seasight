from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import column, create_engine, extract, select, text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import yaml
from google.cloud.sql.connector import Connector
import uvicorn
import os
import pandas as pd
from dotenv import load_dotenv
from sqlmodel import create_engine, select, and_, func, String
from sqlalchemy.exc import SQLAlchemyError
from typing import Annotated, List, Optional
from pydantic import BaseModel
from models import ImpactDataModel, TimePeriodModel, RealTimeDataModel, PredictedDataModel, DailyPeakDataModel




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

# Define Pydantic response models
class MonthlyAverage(BaseModel):
    month: int
    avg: float

class BuiltUpAreaToThreshold(BaseModel):
    threshold: float
    area: float

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
async def get_current_level(
    session: SessionDep
) -> dict:

    query = select(RealTimeDataModel.timestamp, RealTimeDataModel.tidal_level).order_by(
        RealTimeDataModel.timestamp.desc()
    ).limit(1)
    
    result = session.execute(query).first()
    
    if result:
        return {"timestamp": result[0], "tidal_level": result[1]}
    else:
        return {"timestamp": None, "tidal_level": None}
    
@app.get("/api/map/realtime-data/by-date/max")
async def get_max_realtime_tidal_level_for_date(
    session: SessionDep,
    selected_date: Optional[datetime] = Query(default=None, description="Selected date in ISO format"),
) -> dict:
    if not selected_date:
        selected_date = datetime.now()
    
    # order by tidal_level and take the first result
    query = select(RealTimeDataModel.timestamp, RealTimeDataModel.tidal_level).where(
        func.date(RealTimeDataModel.timestamp) == func.date(selected_date),
        RealTimeDataModel.tidal_level < 2.0
    ).order_by(RealTimeDataModel.tidal_level.desc()).limit(1)
    
    result = session.execute(query).first()
    
    if result:
        return {"timestamp": result[0], "tidal_level": result[1]}
    else:
        return {"timestamp": None, "tidal_level": None}

@app.get("/api/map/predicted-data/by-date/max")
async def get_max_predicted_tidal_level_for_date(
    session: SessionDep,
    selected_date: Optional[datetime] = Query(default=None, description="Selected date in ISO format"),
) -> dict:
    if not selected_date:
        selected_date = datetime.now()
    
    # order by tidal_level and take the first result
    query = select(PredictedDataModel.timestamp, PredictedDataModel.tidal_level).where(
        func.date(PredictedDataModel.timestamp) == func.date(selected_date),
        PredictedDataModel.tidal_level < 2.0
    ).order_by(PredictedDataModel.tidal_level.desc()).limit(1)
    
    result = session.execute(query).first()
    
    if result:
        return {"timestamp": result[0], "tidal_level": result[1]}
    else:
        return {"timestamp": None, "tidal_level": None}

@app.get("/api/map/predicted-data/date-on-max-level")
async def get_date_for_max_predicted_level(
    session: SessionDep
) -> dict:
    
    start_date = datetime.today()
    # order by tidal_level and take the first result
    query = select(PredictedDataModel.timestamp, PredictedDataModel.tidal_level).where(
        func.date(PredictedDataModel.timestamp) > func.date(start_date),
        PredictedDataModel.tidal_level < 2.0
    ).order_by(PredictedDataModel.tidal_level.desc()).limit(1)
    
    result = session.execute(query).first()
    
    if result:
        return {"timestamp": result[0], "tidal_level": result[1]}
    else:
        return {"timestamp": datetime.now() + timedelta(days=2), "tidal_level": None}
       

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
    final_year = df.loc[len(df) - 1, 'date_month'].year
    df['decade'] = df['decade'].apply(lambda year: f"{year}-{year+9}" if year+9 < final_year else f"{year}-{final_year}")
    # Group by the decade and calculate the average for each group
    grouped_df = df.groupby('decade', as_index=False).agg({'mean_level': 'mean'})
    return grouped_df.to_dict(orient='records')

@app.get('/api/analytics/realtime-data/monthwise/frequency-means')
async def get_realtime_monthwise_frequency_means(
    session: SessionDep,
    threshold_level: Optional[float] = Query(default=None, description="Valid threshold level value"),
    month: int = Query(default=0, description='Enter valid month number')
):
    
    # This approach with a subquery is more reliable
    subquery = (
        select(
            extract('year', DailyPeakDataModel.timestamp).label('year'),
            extract('month', DailyPeakDataModel.timestamp).label('month'),
            func.count().label('days_above_threshold')
        )
        .where(DailyPeakDataModel.tidal_level > threshold_level)
        .group_by(
            extract('year', DailyPeakDataModel.timestamp),
            extract('month', DailyPeakDataModel.timestamp)
        )
        .subquery()
    )
    
    if month == 0:
        final_query = (
            select(
                column('month'),
                # func.cast(column('month'), String).label('month'),
                func.avg(column('days_above_threshold')).label('avg')
            )            
            .select_from(subquery)
            .where(column('month').not_in([6, 7, 8, 9]))
            .group_by(column('month'))
            .order_by(column('month'))
        )

    else:
        final_query = (
            select(
                column('year'),
                func.avg(column('days_above_threshold'))
            )
            .where(column('month') == month)
            .select_from(subquery)
            .group_by(column('year'))
            .order_by(column('year'))
        )
    
    averages = session.execute(final_query).all()

    if month != 0:
        # Create a dictionary from query results for easy lookup
        year_averages = {int(year): float(avg) for year, avg in averages}

        # Fill in gaps for all years from 2012 to 2024
        results = []
        for year in range(2012, 2025):  # 2025 is exclusive, so it goes up to 2024
            avg_value = year_averages.get(year, 0)  # Default to 0 if year doesn't exist
            results.append({"stamp": year, "avg": avg_value})
    else:
        # Convert to list of dictionaries (JSON-serializable)
        results = [
            {"stamp": int(temporal_stamp), "avg": float(avg)} 
            for temporal_stamp, avg in averages 
        ]
    
    # Return response model object instead of DataFrame
    return results



@app.get("/api/analytics/impact-data/threshold-area", response_model=List[BuiltUpAreaToThreshold])
async def get_impact_builtup_area_to_threshold_levels( 
    session: SessionDep,
    region_id: Optional[str] = Query(default=None, description="Valid region id"),
):
    query = select(ImpactDataModel.threshold, ImpactDataModel.area_built_up_sq_km).where(
        ImpactDataModel.polygon_id == region_id
    ).order_by(ImpactDataModel.threshold.asc())

    threshold_area_data = session.execute(query)
    print(threshold_area_data)
    results = [
        {"threshold": float(threshold), "area": float(area)} 
        for threshold, area in threshold_area_data
    ]

    return results


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
