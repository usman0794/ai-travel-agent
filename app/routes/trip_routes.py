from fastapi import APIRouter, Depends

from app.database.db import SessionLocal
from app.models.trip_model import Trip
from app.schemas.trip_schema import TripUpdateSchema
from app.services.auth_service import get_current_user_id

router = APIRouter(tags=["Trips"])


@router.get("/trips")
def get_trips(user_id: int = Depends(get_current_user_id)):
    if not user_id:
        return {"success": False, "message": "Unauthorized"}

    db = SessionLocal()

    try:
        trips = db.query(Trip).filter(Trip.user_id == user_id).all()

        return [
            {
                "id": trip.id,
                "destination": trip.destination,
                "days": trip.days,
                "budget": trip.budget,
                "budget_currency": trip.budget_currency,
                "estimated_cost_usd": trip.estimated_cost_usd,
                "hotels": trip.hotels,
                "selected_hotel": trip.selected_hotel,
                "status": trip.status,
                "start_date": trip.start_date,
                "end_date": trip.end_date,
                "itinerary": trip.itinerary,
            }
            for trip in trips
        ]

    finally:
        db.close()


@router.patch("/trips/{trip_id}/confirm")
def confirm_trip(
    trip_id: int,
    user_id: int = Depends(get_current_user_id),
):
    if not user_id:
        return {"success": False, "message": "Unauthorized"}

    db = SessionLocal()

    try:
        trip = db.query(Trip).filter(
            Trip.id == trip_id,
            Trip.user_id == user_id,
        ).first()

        if not trip:
            return {"success": False, "message": "Trip not found"}

        trip.status = "confirmed"
        db.commit()
        db.refresh(trip)

        return {
            "success": True,
            "message": "Trip confirmed successfully",
            "trip_id": trip.id,
            "status": trip.status,
        }

    finally:
        db.close()


@router.patch("/trips/{trip_id}/cancel")
def cancel_trip(
    trip_id: int,
    user_id: int = Depends(get_current_user_id),
):
    if not user_id:
        return {"success": False, "message": "Unauthorized"}

    db = SessionLocal()

    try:
        trip = db.query(Trip).filter(
            Trip.id == trip_id,
            Trip.user_id == user_id,
        ).first()

        if not trip:
            return {"success": False, "message": "Trip not found"}

        trip.status = "cancelled"
        db.commit()
        db.refresh(trip)

        return {
            "success": True,
            "message": "Trip cancelled successfully",
            "trip_id": trip.id,
            "status": trip.status,
        }

    finally:
        db.close()


@router.patch("/trips/{trip_id}")
def update_trip(
    trip_id: int,
    data: TripUpdateSchema,
    user_id: int = Depends(get_current_user_id),
):
    if not user_id:
        return {"success": False, "message": "Unauthorized"}

    db = SessionLocal()

    try:
        trip = db.query(Trip).filter(
            Trip.id == trip_id,
            Trip.user_id == user_id,
        ).first()

        if not trip:
            return {"success": False, "message": "Trip not found"}

        if data.destination:
            trip.destination = data.destination

        if data.days:
            trip.days = data.days

        if data.budget:
            trip.budget = data.budget

        db.commit()
        db.refresh(trip)

        return {
            "success": True,
            "message": "Trip updated successfully",
            "trip": {
                "id": trip.id,
                "destination": trip.destination,
                "days": trip.days,
                "budget": trip.budget,
                "status": trip.status,
            },
        }

    finally:
        db.close()