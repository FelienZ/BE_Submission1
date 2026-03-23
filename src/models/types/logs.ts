export type Loggers = {
    id: string,
    message: string,
    timestamp: Date,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    userId: string
}