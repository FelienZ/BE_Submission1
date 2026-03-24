type User = {
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt?: Date,
    updatedAt?: Date
}
type UserResponse = Omit<User, 'password'> //remove password utk response
type UserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'> // request payload create

export type { User, UserResponse, UserRequest };