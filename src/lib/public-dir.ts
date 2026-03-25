import { join } from "path"

export function getPublicDir(importDir: string, fallbackRelative = "../public"): string {
    const override = process.env.ANTI_API_PUBLIC_DIR
    if (override && override.trim()) {
        return override
    }
    return join(importDir, fallbackRelative)
}
