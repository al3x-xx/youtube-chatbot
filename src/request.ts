import { createSha1, jsonToCookieString, userAgent } from "./misc.js"

export class ytRequest {
    private readonly origin: string = "https://www.youtube.com"

    private readonly apiUrl: string = `${this.origin}/youtubei/v1/live_chat/`
    private readonly apiKey: string = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"

    private readonly cookieString: string

    public constructor(private cookies: any) {
        this.cookieString = jsonToCookieString(cookies)
    }

    public requestGet = async (url: string): Promise<string> => {
        return await fetch(`${this.origin}${url}`, {
            headers: {
                "Cookie": this.cookieString,
                "User-Agent": userAgent
            }
        }).then(r => r.text())
    }

    public requestAPI = async (method: string, data: object): Promise<any | undefined> => {     
        try {
            return await fetch(`${this.apiUrl}${method}?key=${this.apiKey}`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "X-Origin": this.origin,
                    "Authorization": this.getAuthorizationHash(),
                    "Cookie": this.cookieString,
                    "User-Agent": userAgent
                }
            }).then(r => r.json())
        } catch {
            return undefined
        }
    }

    private getAuthorizationHash = (): string => {
        const seconds: number = Date.now() / 1000 | 0
        return `SAPISIDHASH ${seconds}_${createSha1(`${seconds} ${this.cookies.SAPISID} ${this.origin}`)}`
    }
}