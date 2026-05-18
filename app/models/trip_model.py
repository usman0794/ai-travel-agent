from sqlalchemy import Column, Integer, String

from app.database.base import Base


class Trip(Base):

    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    destination = Column(String)

    days = Column(Integer)

    budget = Column(Integer)

    estimated_cost = Column(Integer)

    hotels = Column(String)