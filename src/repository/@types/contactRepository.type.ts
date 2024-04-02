export interface ContactCreateRepository {
    name: string
    email: string
    password: string

}

export interface ContactUpdateRepository{
    id: string
    name?: string
    email?: string
    password?: string
}
