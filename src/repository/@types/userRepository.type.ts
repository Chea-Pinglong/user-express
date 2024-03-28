export interface UserCreateRepository {
    name: string
    email: string
    password: string

}

export interface UserUpdateRepository{
    id: string
    name?: string
    email?: string
    password?: string
}
