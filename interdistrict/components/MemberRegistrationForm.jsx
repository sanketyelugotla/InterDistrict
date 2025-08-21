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
import { motion, AnimatePresence } from "framer-motion"

// Animation variants
const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    }
}

const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.98 }
}

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
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register Your Details
                    </Button>
                </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                    >
                        <DialogTitle>Register Your Details</DialogTitle>
                    </motion.div>
                </DialogHeader>
                <Card>
                    <CardContent className="pt-6">
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            transition={{ staggerChildren: 0.05 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div className="space-y-2" variants={formItemVariants}>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                    />
                                </motion.div>

                                <motion.div className="space-y-2" variants={formItemVariants}>
                                    <Label htmlFor="designation">Designation *</Label>
                                    <Input
                                        id="designation"
                                        value={formData.designation}
                                        onChange={(e) => handleInputChange("designation", e.target.value)}
                                        required
                                    />
                                </motion.div>

                                <motion.div className="space-y-2" variants={formItemVariants}>
                                    <Label htmlFor="workingPlace">Working Place *</Label>
                                    <Input
                                        id="workingPlace"
                                        value={formData.workingPlace}
                                        onChange={(e) => handleInputChange("workingPlace", e.target.value)}
                                        required
                                    />
                                </motion.div>

                                <motion.div className="space-y-2" variants={formItemVariants}>
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
                                </motion.div>

                                <motion.div className="space-y-2" variants={formItemVariants}>
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
                                </motion.div>

                                <motion.div className="space-y-2" variants={formItemVariants}>
                                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                                    <Input
                                        id="mobileNumber"
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                                        required
                                    />
                                </motion.div>

                                <motion.div className="space-y-2 md:col-span-2" variants={formItemVariants}>
                                    <Label htmlFor="management">Management *</Label>
                                    <Input
                                        id="management"
                                        value={formData.management}
                                        onChange={(e) => handleInputChange("management", e.target.value)}
                                        required
                                    />
                                </motion.div>
                            </div>

                            <motion.div
                                className="flex gap-4 pt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.2 }}
                            >
                                <motion.div
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="flex-1"
                                >
                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? "Registering..." : "Register Details"}
                                    </Button>
                                </motion.div>
                                <motion.div
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}