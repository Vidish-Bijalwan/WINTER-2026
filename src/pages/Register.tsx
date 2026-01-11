import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Mail, Building2, UserCircle, Loader2, Activity, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordStrength } from "@/components/ui/PasswordStrength";

export default function Register() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        organization: "",
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (!agreeToTerms) {
            toast({
                title: "Terms Required",
                description: "Please agree to the terms and conditions",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name || undefined,
                organization: formData.organization || undefined,
            });

            if (result.success) {
                toast({
                    title: "Registration Successful",
                    description: "Welcome to TopoShape Insights!",
                });
                navigate("/dashboard");
            } else {
                toast({
                    title: "Registration Failed",
                    description: result.error || "Please try again",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/10 rounded-full blur-sm"
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 30 + Math.random() * 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            left: Math.random() * 100 + "%",
                            top: Math.random() * 100 + "%",
                        }}
                    />
                ))}
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Back to Login Button */}
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                <Card className="backdrop-blur-xl bg-slate-900/80 border-slate-700/50 shadow-2xl">
                    <CardHeader className="space-y-3 text-center pb-6">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-center mb-2"
                        >
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                <Activity className="w-10 h-10 text-primary" />
                            </div>
                        </motion.div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Join TopoShape
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Create your organizational account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Two column layout for desktop */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="text-slate-200">
                                        Full Name
                                    </Label>
                                    <div className="relative group">
                                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="full_name"
                                            name="full_name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-slate-200">
                                        Username <span className="text-red-400">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="johndoe"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-200">
                                        Email <span className="text-red-400">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="organization" className="text-slate-200">
                                        Organization
                                    </Label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="organization"
                                            name="organization"
                                            type="text"
                                            placeholder="Your Company"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-200">
                                    Password <span className="text-red-400">*</span>
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <PasswordStrength password={formData.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-200">
                                    Confirm Password <span className="text-red-400">*</span>
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-2 pt-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreeToTerms}
                                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                                    className="border-slate-700 mt-1"
                                />
                                <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer select-none">
                                    I agree to the{" "}
                                    <Link to="#" className="text-primary hover:text-primary/80">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="#" className="text-primary hover:text-primary/80">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900/80 px-2 text-slate-400">Already have an account?</span>
                            </div>
                        </div>

                        <Link to="/login">
                            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800/50">
                                Sign In Instead
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Powered by Topological Data Analysis
                </p>
            </motion.div>
        </div>
    );
}
