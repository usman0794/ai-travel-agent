from fastapi import APIRouter, Depends

from app.agents.travel_agent import ask_travel_agent
from app.services.auth_service import get_current_user_id

router = APIRouter(tags=["Agent"])


@router.get("/agent")
def agent(
    message: str,
    user_id: int = Depends(get_current_user_id),
):
    if not user_id:
        return {
            "success": False,
            "message": "Unauthorized",
        }

    response = ask_travel_agent(message, user_id)

    return {
        "success": True,
        "response": response,
    }