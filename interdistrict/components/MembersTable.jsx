import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, MapPin, Building, Download, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo } from "react"

// Animation variants (unchanged)
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

export default function MembersTable({
    members,
    allMembers,
    loading,
    currentPage,
    totalPages,
    totalMembers,
    onPageChange
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [designationFilter, setDesignationFilter] = useState(undefined)
    const [managementFilter, setManagementFilter] = useState(undefined)

    // Memoized data (unchanged)
    const designations = useMemo(() => {
        const uniqueDesignations = new Set(allMembers.map(member => member.designation).filter(Boolean))
        return Array.from(uniqueDesignations).sort()
    }, [allMembers])

    const managements = useMemo(() => {
        const uniqueManagements = new Set(allMembers.map(member => member.management).filter(Boolean))
        return Array.from(uniqueManagements).sort()
    }, [allMembers])

    const filteredMembers = useMemo(() => {
        let filtered = members
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(member =>
                member.name?.toLowerCase().includes(query) ||
                member.designation?.toLowerCase().includes(query) ||
                member.workingPlace?.toLowerCase().includes(query) ||
                member.workingDistrict?.toLowerCase().includes(query) ||
                member.willingDistrict?.toLowerCase().includes(query) ||
                member.mobileNumber?.includes(query) ||
                member.management?.toLowerCase().includes(query)
            )
        }
        if (designationFilter) {
            filtered = filtered.filter(member => member.designation === designationFilter)
        }
        if (managementFilter) {
            filtered = filtered.filter(member => member.management === managementFilter)
        }
        return filtered
    }, [members, searchQuery, designationFilter, managementFilter])

    const filteredAllMembers = useMemo(() => {
        let filtered = allMembers
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(member =>
                member.name?.toLowerCase().includes(query) ||
                member.designation?.toLowerCase().includes(query) ||
                member.workingPlace?.toLowerCase().includes(query) ||
                member.workingDistrict?.toLowerCase().includes(query) ||
                member.willingDistrict?.toLowerCase().includes(query) ||
                member.mobileNumber?.includes(query) ||
                member.management?.toLowerCase().includes(query)
            )
        }
        if (designationFilter) {
            filtered = filtered.filter(member => member.designation === designationFilter)
        }
        if (managementFilter) {
            filtered = filtered.filter(member => member.management === managementFilter)
        }
        return filtered
    }, [allMembers, searchQuery, designationFilter, managementFilter])

    const downloadExcel = () => {
        import("xlsx")
            .then((XLSX) => {
                const exportData = filteredAllMembers.map((member) => ({
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
                    { wch: 20 },
                    { wch: 15 },
                    { wch: 25 },
                    { wch: 18 },
                    { wch: 18 },
                    { wch: 15 },
                    { wch: 15 },
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

    const clearAllFilters = () => {
        setSearchQuery("")
        setDesignationFilter(undefined)
        setManagementFilter(undefined)
    }

    const hasActiveFilters = searchQuery || designationFilter || managementFilter

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 3) {
                endPage = 4;
            }
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }
            if (startPage > 2) {
                pages.push('...');
            }
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
        return pages;
    };

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
            <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                            <Building className="w-6 h-6 text-primary" />
                            Members Directory ({totalMembers} total, {filteredMembers.length} on this page)
                        </CardTitle>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {/* Enhanced Search Input */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-10 py-2 rounded-full bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all duration-200 placeholder:text-gray-400 text-gray-800"
                                />
                                {searchQuery && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.button>
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
                                        className="flex items-center gap-2 bg-white border-gray-200 text-gray-800 font-medium rounded-full px-4 py-2 shadow-sm transition-all duration-200"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Excel
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <Filter className="h-4 w-4 text-primary" />
                            <span>Filters</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                            <Select value={designationFilter} onValueChange={setDesignationFilter}>
                                <SelectTrigger className="w-full bg-white border border-gray-400 rounded-lg py-2 px-4 text-gray-800 focus:ring-2 focus:ring-primary/20 shadow-sm transition-all duration-200 data-[placeholder]:text-gray-600">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg">
                                    <SelectItem value={undefined} className="text-gray-800 hover:bg-gray-50">All Designations</SelectItem>
                                    {designations.map((designation) => (
                                        <SelectItem key={designation} value={designation} className="text-gray-800 hover:bg-gray-50">
                                            {designation}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={managementFilter} onValueChange={setManagementFilter}>
                                <SelectTrigger className="w-full bg-white border border-gray-400 rounded-lg py-2 px-4 text-gray-800 focus:ring-2 focus:ring-primary/20 shadow-sm transition-all duration-200 data-[placeholder]:text-gray-600">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg">
                                    <SelectItem value={undefined} className="text-gray-800 hover:bg-gray-50">All Managements</SelectItem>
                                    {managements.map((management) => (
                                        <SelectItem key={management} value={management} className="text-gray-800 hover:bg-gray-50">
                                            {management}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        variant="outline"
                                        onClick={clearAllFilters}
                                        className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-800 font-medium rounded-full px-4 py-2 shadow-sm transition-all duration-200"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear Filters
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
                                {hasActiveFilters ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                                            <Search className="h-6 w-6 text-gray-500" />
                                        </div>
                                        <p className="font-medium text-gray-800">No matches found</p>
                                        <p className="text-sm text-gray-500">No members match your filters</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearAllFilters}
                                            className="mt-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-800 rounded-full"
                                        >
                                            Clear all filters
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                                            <Building className="h-6 w-6 text-gray-500" />
                                        </div>
                                        <p className="font-medium text-gray-800">No members found</p>
                                        <p className="text-sm text-gray-500">Try adjusting your search filters</p>
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
                                {/* Active Filters Info */}
                                {hasActiveFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-xl gap-2"
                                    >
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                            <Filter className="h-4 w-4 text-primary" />
                                            <span className="font-medium">Active filters:</span>
                                            {searchQuery && (
                                                <Badge variant="secondary" className="bg-primary/10 text-primary font-medium py-1 px-2 rounded-full flex items-center gap-1">
                                                    Search: {searchQuery}
                                                    <motion.div
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <X
                                                            className="h-4 w-4 cursor-pointer text-primary/60 hover:text-primary"
                                                            onClick={() => setSearchQuery("")}
                                                        />
                                                    </motion.div>
                                                </Badge>
                                            )}
                                            {designationFilter && (
                                                <Badge variant="secondary" className="bg-primary/10 text-primary font-medium py-1 px-2 rounded-full flex items-center gap-1">
                                                    Designation: {designationFilter}
                                                    <motion.div
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <X
                                                            className="h-4 w-4 cursor-pointer text-primary/60 hover:text-primary"
                                                            onClick={() => setDesignationFilter(undefined)}
                                                        />
                                                    </motion.div>
                                                </Badge>
                                            )}
                                            {managementFilter && (
                                                <Badge variant="secondary" className="bg-primary/10 text-primary font-medium py-1 px-2 rounded-full flex items-center gap-1">
                                                    Management: {managementFilter}
                                                    <motion.div
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <X
                                                            className="h-4 w-4 cursor-pointer text-primary/60 hover:text-primary"
                                                            onClick={() => setManagementFilter(undefined)}
                                                        />
                                                    </motion.div>
                                                </Badge>
                                            )}
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearAllFilters}
                                                className="h-8 px-3 text-primary hover:bg-primary/10 rounded-full"
                                            >
                                                Clear all
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* Table and Pagination (unchanged) */}
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

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 px-2">
                                        <div className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onPageChange(1)}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronsLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onPageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <div className="flex items-center space-x-1">
                                                {getPageNumbers().map((pageNum, index) => (
                                                    pageNum === '...' ? (
                                                        <span key={`ellipsis-${index}`} className="px-2 py-1">
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            key={`page-${pageNum}`}
                                                            variant={currentPage === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => onPageChange(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    )
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onPageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onPageChange(totalPages)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronsRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    )
}