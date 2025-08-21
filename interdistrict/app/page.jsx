"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import MembersTable from "@/components/MembersTable"
import MemberRegistrationForm from "@/components/MemberRegistrationForm"
import { districts } from "@/lib/models/Member"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [workingDistrict, setWorkingDistrict] = useState("all")
  const [willingDistrict, setWillingDistrict] = useState("all")
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (workingDistrict !== "all") params.append("workingDistrict", workingDistrict)
      if (willingDistrict !== "all") params.append("willingDistrict", willingDistrict)

      const response = await fetch(`/api/members?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setMembers(result.data)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSearch = () => {
    fetchMembers()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">District Transfer Management System</h1>
          <p className="text-muted-foreground">Find and register for district transfer opportunities</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="working-district">Your Working District</Label>
                <Select value={workingDistrict} onValueChange={setWorkingDistrict}>
                  <SelectTrigger id="working-district" className="bg-input">
                    <SelectValue placeholder="Select working district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="willing-district">Your Required/Willing District</Label>
                <Select value={willingDistrict} onValueChange={setWillingDistrict}>
                  <SelectTrigger id="willing-district" className="bg-input">
                    <SelectValue placeholder="Select required district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button
                onClick={handleSearch}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search Members"}
              </Button>

              <MemberRegistrationForm onMemberAdded={fetchMembers} />
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <MembersTable members={members} loading={loading} />
      </div>

      <Toaster />
    </div>
  )
}
