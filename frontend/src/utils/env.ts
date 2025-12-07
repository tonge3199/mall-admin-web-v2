export function getEnv(key: string, fallback?: string): string {
    const value = import.meta.env[key] as string | undefined
    if (value === undefined || value === '') {
        if (fallback !== undefined) return fallback
        throw new Error(`Missing environment variable: ${key}`)
    }
    return value
}
