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
    __tablename__ = "predicted_incois"

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default=None)
    tidal_level: float = Field(default=None)

class DailyPeakDataModel(SQLModel, table=True):
    __tablename__ = 'ioc_historical'

    timestamp: datetime = Field(default=None, primary_key=True)
    tidal_level: float = Field(default=None)

class ImpactDataModel(SQLModel, table=True):
    __tablename__ = 'impact_data'

    id: Optional[int] = Field(default=None, primary_key=True)
    buildings: float = Field(default=None)
    threshold: float = Field(default=None)
    roads_km: float = Field(default=None)
    total_area_sq_km: float = Field(default=None)
    area_agriculture_aquaculture_sq_km: float = Field(default=None)
    area_agriculture_plantation_sq_km: float = Field(default=None)
    area_other_classes_sq_km: float = Field(default=None)
    land_area_sq_km: float = Field(default=None)
    area_built_up_sq_km: float = Field(default=None)
    polygon_id: str = Field(default=None)




