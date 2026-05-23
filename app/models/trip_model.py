from sqlalchemy import Column, Integer, String, Float, Date

from app.database.base import Base


class Trip(Base):

    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    destination = Column(String)

    days = Column(Integer)

    budget = Column(Integer)

    estimated_cost = Column(Integer)

    hotels = Column(String)

    selected_hotel = Column(String)

    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)

    status = Column(String, default="draft")

    itinerary = Column(String, nullable=True)

    user_id = Column(Integer)