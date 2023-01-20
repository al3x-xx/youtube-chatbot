import { createSha1, jsonToCookieString, userAgent } from "./misc.js"

export class ytRequest {
    private readonly origin: string = "https://www.youtube.com"

    private readonly apiUrl: string = `${this.origin}/youtubei/v1/live_chat/`
    private readonly apiKey: string = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"

    private readonly cookieString: string

    constructor(private readonly cookies: any) {
        this.cookieString = jsonToCookieString(cookies)
    }

    async requestGet(url: string): Promise<string> {
        return await fetch(`${this.origin}${url}`, {
            headers: {
                "Cookie": this.cookieString,
                "User-Agent": userAgent
            }
        }).then(r => r.text())
    }

    async requestAPI(method: string, data: object): Promise<any | undefined> {
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

    private getAuthorizationHash(): string {
        const seconds: number = Math.trunc(Date.now() / 1000)
        return `SAPISIDHASH ${seconds}_${createSha1(`${seconds} ${this.cookies.SAPISID} ${this.origin}`)}`
    }
}