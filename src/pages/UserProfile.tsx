import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCurrentUser, logout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Building2, Shield, Calendar, LogOut, Save } from "lucide-react";

export default function UserProfile() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState(getCurrentUser());
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: user?.full_name || "",
        organization: user?.organization || "",
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate("/login");
        } else {
            setUser(currentUser);
            setFormData({
                full_name: currentUser.full_name || "",
                organization: currentUser.organization || "",
            });
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        // TODO: Implement API call to update profile
        setTimeout(() => {
            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
            });
            setIsLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        logout();
        toast({
            title: "Logged Out",
            description: "You have been logged out successfully.",
        });
        navigate("/login");
    };

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">User Profile</h1>
                        <p className="text-muted-foreground">Manage your account settings</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>View and update your profile details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="username"
                                            value={user.username}
                                            disabled
                                            className="pl-10 bg-muted"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="pl-10 bg-muted"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="organization">Organization</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="organization"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            placeholder="Enter your organization"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-medium">Role</p>
                                        <p className="text-sm text-muted-foreground">Your access level</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                                    {user.role}
                                </span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Account ID</p>
                                        <p className="text-sm text-muted-foreground">Unique identifier</p>
                                    </div>
                                </div>
                                <span className="font-mono text-sm text-muted-foreground">
                                    {user.id.substring(0, 8)}...
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password and security settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full md:w-auto">
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
