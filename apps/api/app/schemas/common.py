from pydantic import BaseModel, ConfigDict


class FoundationResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: str
    message: str
