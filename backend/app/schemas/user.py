from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password:str
    

class UserLogin(BaseModel):
    email:EmailStr
    password:str
    
    
class UserOut(BaseModel):
    id:int
    email:str
    username:str
    
    class Config:
        orm_mode = True