import { existsSync } from "fs"
import { dirname, join } from "path"

import { runCli } from "./main"

const exeDir = dirname(process.execPath)
const publicDir = join(exeDir, "public")
const rustProxyPath = join(exeDir, "anti-proxy.exe")

process.env.ANTI_API_PACKAGE_MANAGER = process.env.ANTI_API_PACKAGE_MANAGER || "winget"
process.env.ANTI_API_NO_SELF_UPDATE = process.env.ANTI_API_NO_SELF_UPDATE || "1"

if (!process.env.ANTI_API_PUBLIC_DIR && existsSync(publicDir)) {
    process.env.ANTI_API_PUBLIC_DIR = publicDir
}

let rustProxy: ReturnType<typeof Bun.spawn> | null = null

function stopRustProxy(): void {
    if (!rustProxy) return
    try {
        rustProxy.kill()
    } catch {
        // Ignore shutdown errors from child cleanup.
    }
    rustProxy = null
}

function startRustProxy(): void {
    if (!existsSync(rustProxyPath)) return
    rustProxy = Bun.spawn([rustProxyPath], {
        stdout: "ignore",
        stderr: "ignore",
    })
}

process.on("SIGINT", () => {
    stopRustProxy()
    process.exit(130)
})

process.on("SIGTERM", () => {
    stopRustProxy()
    process.exit(143)
})

startRustProxy()

try {
    const rawArgs = process.argv.slice(2)
    await runCli(rawArgs.length > 0 ? rawArgs : ["start"])
} finally {
    stopRustProxy()
}
