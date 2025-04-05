from typing import Optional
from pydantic import BaseModel
from sqlmodel import Field, SQLModel
from datetime import datetime


class TimePeriodModel(BaseModel):
    start_date: datetime
    end_date: datetime

class RealTimeDataModel(SQLModel, table=True):
    __tablename__ = "ioc_observed"

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default=None)
    tidal_level: float = Field(default=None)

class PredictedDataModel(SQLModel, table=True):
    __tablename__ = "xx_predicted"

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default=None)
    tidal_level: float = Field(default=None)

class DailyPeakDataModel(SQLModel, table=True):
    __tablename__ = 'ioc_historical'

    timestamp: datetime = Field(default=None, primary_key=True)
    tidal_level: float = Field(default=None)



