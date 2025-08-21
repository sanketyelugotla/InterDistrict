"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus } from "lucide-react"
import { districts } from "@/lib/models/Member"
import { useToast } from "@/hooks/use-toast"

export default function MemberRegistrationForm({ onMemberAdded }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        workingPlace: "",
        workingDistrict: "",
        willingDistrict: "",
        mobileNumber: "",
        management: "",
    })

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/members", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Your details have been registered successfully.",
                })
                setFormData({
                    name: "",
                    designation: "",
                    workingPlace: "",
                    workingDistrict: "",
                    willingDistrict: "",
                    mobileNumber: "",
                    management: "",
                })
                setOpen(false)
                onMemberAdded()
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to register details.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to register details. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register Your Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Register Your Details</DialogTitle>
                </DialogHeader>
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation *</Label>
                                    <Input
                                        id="designation"
                                        value={formData.designation}
                                        onChange={(e) => handleInputChange("designation", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="workingPlace">Working Place *</Label>
                                    <Input
                                        id="workingPlace"
                                        value={formData.workingPlace}
                                        onChange={(e) => handleInputChange("workingPlace", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="workingDistrict">Working District *</Label>
                                    <Select
                                        value={formData.workingDistrict}
                                        onValueChange={(value) => handleInputChange("workingDistrict", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select working district" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {districts.map((district) => (
                                                <SelectItem key={district} value={district}>
                                                    {district}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="willingDistrict">Willing/Required District *</Label>
                                    <Select
                                        value={formData.willingDistrict}
                                        onValueChange={(value) => handleInputChange("willingDistrict", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select willing district" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {districts.map((district) => (
                                                <SelectItem key={district} value={district}>
                                                    {district}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                                    <Input
                                        id="mobileNumber"
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="management">Management *</Label>
                                    <Input
                                        id="management"
                                        value={formData.management}
                                        onChange={(e) => handleInputChange("management", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? "Registering..." : "Register Details"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
