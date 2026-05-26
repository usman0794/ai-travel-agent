from sqlalchemy import Column, Integer, String

from app.database.base import Base


class Trip(Base):

    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    # ROUTE
    source = Column(String, nullable=True)
    destination = Column(String)

    # TRIP DETAILS
    days = Column(Integer)

    # BUDGET
    budget = Column(Integer)
    budget_currency = Column(String)

    # NORMALIZED USD COST
    estimated_cost_usd = Column(Integer)

    # HOTEL
    hotels = Column(String)
    selected_hotel = Column(String)

    # DATES
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)

    # STATUS
    status = Column(String, default="draft")

    # AI ITINERARY
    itinerary = Column(String, nullable=True)

    # RELATION
    user_id = Column(Integer)