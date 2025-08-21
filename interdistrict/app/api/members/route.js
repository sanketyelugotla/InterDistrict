import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
    try {
        const client = await clientPromise
        const db = client.db("district_transfer")

        const { searchParams } = new URL(request.url)
        const willingDistrict = searchParams.get("workingDistrict")
        const workingDistrict = searchParams.get("willingDistrict")

        const query = {}

        if (workingDistrict && workingDistrict !== "all") {
            query.workingDistrict = workingDistrict
        }

        if (willingDistrict && willingDistrict !== "all") {
            query.willingDistrict = willingDistrict
        }

        const members = await db.collection("members").find(query).toArray()

        return NextResponse.json({ success: true, data: members })
    } catch (error) {
        console.error("Error fetching members:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const client = await clientPromise
        const db = client.db("district_transfer")

        const body = await request.json()

        // Validate required fields
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
