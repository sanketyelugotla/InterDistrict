"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Building, Download } from "lucide-react"

export default function MembersTable({ members, loading }) {
    const downloadExcel = () => {
        import("xlsx")
            .then((XLSX) => {
                const exportData = members.map((member) => ({
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

    if (loading) {
        return (
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
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Members Directory ({members.length} found)
                    </CardTitle>
                    {members.length > 0 && (
                        <Button
                            onClick={downloadExcel}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-transparent"
                        >
                            <Download className="w-4 h-4" />
                            Download Excel
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {members.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No members found matching your search criteria.</div>
                ) : (
                    <div className="overflow-x-auto">
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
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member._id}>
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
