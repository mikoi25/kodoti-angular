export interface Token{
  succeeded:string;
  accessToken:string;
}

export interface UserLogin{
    Email:string;
    Password:string;
}

export interface UserCreate{
    FirstName:string;
    LastName:string;
    Email:string;
    Password:string;
}


export interface UserResponse {
  hasItems:boolean;
  items :User[];
  total: number;
  page: number;
  pages: number;

}

export interface User{
  firstName: string;
  lastName: string;
  Email:string;
}
