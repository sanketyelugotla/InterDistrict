"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, MapPin, Building, Download, Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo } from "react"

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: "easeOut" }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    }
}

const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.98 }
}

export default function MembersTable({ members, loading }) {
    const [searchQuery, setSearchQuery] = useState("")

    // Filter members based on search query across all fields
    const filteredMembers = useMemo(() => {
        if (!searchQuery) return members

        const query = searchQuery.toLowerCase().trim()
        return members.filter(member =>
            member.name?.toLowerCase().includes(query) ||
            member.designation?.toLowerCase().includes(query) ||
            member.workingPlace?.toLowerCase().includes(query) ||
            member.workingDistrict?.toLowerCase().includes(query) ||
            member.willingDistrict?.toLowerCase().includes(query) ||
            member.mobileNumber?.includes(query) ||
            member.management?.toLowerCase().includes(query)
        )
    }, [members, searchQuery])

    const downloadExcel = () => {
        import("xlsx")
            .then((XLSX) => {
                const exportData = filteredMembers.map((member) => ({
                    Name: member.name,
                    Designation: member.designation,
                    "Working Place": member.workingPlace,
                    "Working District": member.workingDistrict,
                    "Willing District": member.willingDistrict,
                    "Mobile Number": member.mobileNumber,
                    Management: member.management,
                }))

                const wb = XLSX.utils.book_new()
                const ws = XLSX.utils.json_to_sheet(exportData)

                const colWidths = [
                    { wch: 20 }, // Name
                    { wch: 15 }, // Designation
                    { wch: 25 }, // Working Place
                    { wch: 18 }, // Working District
                    { wch: 18 }, // Willing District
                    { wch: 15 }, // Mobile Number
                    { wch: 15 }, // Management
                ]
                ws["!cols"] = colWidths

                XLSX.utils.book_append_sheet(wb, ws, "Members Directory")

                const date = new Date().toISOString().split("T")[0]
                const filename = `Members_Directory_${date}.xlsx`

                XLSX.writeFile(wb, filename)
            })
            .catch((error) => {
                console.error("Error loading xlsx library:", error)
                alert("Error downloading Excel file. Please try again.")
            })
    }

    const clearSearch = () => setSearchQuery("")

    if (loading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Members Directory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground">Loading members...</div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" key={members.length}>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Members Directory ({filteredMembers.length} found)
                        </CardTitle>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {/* 🔍 Enhanced Search Input */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black pointer-events-none" />
                                <Input
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-10 rounded-full bg-white border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-gray-600"
                                />


                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {filteredMembers.length > 0 && (
                                <motion.div
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="flex-shrink-0"
                                >
                                    <Button
                                        onClick={downloadExcel}
                                        variant="outline"
                                        className="flex items-center gap-2 bg-transparent whitespace-nowrap w-full sm:w-auto"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Excel
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {filteredMembers.length === 0 ? (
                            <motion.div
                                key="no-members"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-center py-8 text-muted-foreground"
                            >
                                {searchQuery ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                                            <Search className="h-6 w-6" />
                                        </div>
                                        <p className="font-medium">No matches found</p>
                                        <p className="text-sm">No members match &quot;{searchQuery}&quot;</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearSearch}
                                            className="mt-2"
                                        >
                                            Clear search
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                                            <Building className="h-6 w-6" />
                                        </div>
                                        <p className="font-medium">No members found</p>
                                        <p className="text-sm">Try adjusting your search filters</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="members-table"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-x-auto"
                            >
                                {/* Search Results Info */}
                                {searchQuery && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2 text-sm">
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                Showing {filteredMembers.length} results for &quot;{searchQuery}&quot;
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearSearch}
                                            className="h-8 px-2"
                                        >
                                            Clear
                                        </Button>
                                    </motion.div>
                                )}

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Designation</TableHead>
                                            <TableHead>Working Place</TableHead>
                                            <TableHead>Working District</TableHead>
                                            <TableHead>Willing District</TableHead>
                                            <TableHead>Mobile Number</TableHead>
                                            <TableHead>Management</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                                        {filteredMembers.map((member) => (
                                            <motion.tr
                                                key={member._id}
                                                variants={itemVariants}
                                                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                                                transition={{ duration: 0.1 }}
                                            >
                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{member.designation}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Building className="w-3 h-3 text-muted-foreground" />
                                                        {member.workingPlace}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 text-muted-foreground" />
                                                        {member.workingDistrict}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{member.willingDistrict}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                                        {member.mobileNumber}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{member.management}</TableCell>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </Table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    )
}
