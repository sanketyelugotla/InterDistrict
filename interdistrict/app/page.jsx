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
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"

// Faster animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05 // Reduced from 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 10, opacity: 0 }, // Reduced from y:20
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3, // Reduced from 0.5
      ease: "easeOut"
    }
  }
}

const cardVariants = {
  hidden: { scale: 0.98, opacity: 0 }, // Reduced scale effect
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.25, // Reduced from 0.4
      ease: "easeOut"
    }
  }
}

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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        {/* Header with faster animation */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -30, opacity: 0 }} // Reduced from y: -50
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }} // Reduced from 0.6
        >
          <motion.h1
            className="text-3xl font-bold text-foreground mb-2"
            initial={{ scale: 0.95 }} // Reduced from 0.9
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }} // Reduced delay and duration
          >
            District Transfer Management System
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }} // Reduced delay and duration
          >
            Find and register for district transfer opportunities
          </motion.p>
        </motion.div>

        {/* Search Filters with faster animation */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="mb-8">
            <CardHeader>
              <motion.div
                initial={{ x: -10, opacity: 0 }} // Reduced from x: -20
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }} // Reduced delay and duration
              >
                <CardTitle>Search Filters</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="space-y-2" variants={itemVariants}>
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
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
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
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-center"
                initial={{ opacity: 0, y: 10 }} // Reduced from y: 20
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }} // Reduced delay and duration
              >
                <Button
                  onClick={handleSearch}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-transform hover:scale-105"
                  disabled={loading}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Searching..." : "Search Members"}
                </Button>

                <MemberRegistrationForm onMemberAdded={fetchMembers} />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Members Table with faster animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={members.length}
            initial={{ opacity: 0, y: 10 }} // Reduced from y: 20
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} // Reduced from y: -20
            transition={{ duration: 0.25, ease: "easeOut" }} // Reduced from 0.4
          >
            <MembersTable members={members} loading={loading} />
          </motion.div>
        </AnimatePresence>
      </div>

      <Toaster />
      <Footer />
    </div>
  )
}