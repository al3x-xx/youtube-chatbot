import crypto from "crypto"

export const createSha1 = (data: string): string => {
    return crypto.createHash("sha1").update(data).digest("hex")
}

export const jsonToCookieString = (cookies: any): string => {
    return Object.keys(cookies).map(key => {
        return `${key}=${cookies[key]}`
    }).join("; ")
}

export const userAgent: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"