import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

const allowedOrigins = [
    "http://localhost:3000/",
    "https://inter-district.vercel.app/",
]

async function checkAccess(request) {
    const origin = request.headers.get("referer")
    const apiKey = request.headers.get("x-api-key")
    console.log("Backend", apiKey)
    console.log(origin)

    // ✅ Must match both allowed origin & secret key
    if (origin && allowedOrigins.includes(origin) && apiKey === process.env.NEXT_PUBLIC_API_SECRET) {
        return true
    }

    return false
}

export async function GET(request) {
    try {
        if (!(await checkAccess(request))) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
        }

        const client = await clientPromise
        const db = client.db("district_transfer")

        const { searchParams } = new URL(request.url)
        const willingDistrict = searchParams.get("workingDistrict")
        const workingDistrict = searchParams.get("willingDistrict")

        const page = parseInt(searchParams.get("page") || "1", 10)
        const limit = parseInt(searchParams.get("limit") || "100", 10)
        const skip = (page - 1) * limit

        // Build query based on provided filters
        const query = {}
        if (workingDistrict && workingDistrict !== "all") {
            query.workingDistrict = workingDistrict
        }
        if (willingDistrict && willingDistrict !== "all") {
            query.willingDistrict = willingDistrict
        }

        // If no filters are provided, return empty result
        if (Object.keys(query).length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                },
            })
        }

        const members = await db
            .collection("members")
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray()

        const total = await db.collection("members").countDocuments(query)

        return NextResponse.json({
            success: true,
            data: members,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching members:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        if (!(await checkAccess(request))) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
        }

        const client = await clientPromise
        const db = client.db("district_transfer")

        const body = await request.json()

        const requiredFields = [
            "name",
            "designation",
            "workingPlace",
            "workingDistrict",
            "willingDistrict",
            "mobileNumber",
            "management",
        ]
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
            }
        }

        const memberData = {
            ...body,
            createdAt: new Date(),
        }

        const result = await db.collection("members").insertOne(memberData)

        return NextResponse.json({
            success: true,
            data: { _id: result.insertedId, ...memberData },
        })
    } catch (error) {
        console.error("Error adding member:", error)
        return NextResponse.json({ success: false, error: "Failed to add member" }, { status: 500 })
    }
}
