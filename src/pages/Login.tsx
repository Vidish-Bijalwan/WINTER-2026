import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Activity, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(username, password);

            if (result.success) {
                toast({
                    title: "Login Successful",
                    description: `Welcome back!`,
                });
                navigate("/dashboard");
            } else {
                toast({
                    title: "Login Failed",
                    description: result.error || "Invalid credentials",
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
            {/* Animated background particles - Reduced from 20 to 8 */}
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
                className="w-full max-w-md relative z-10"
            >
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
                            TopoShape Insights
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Organizational Anomaly Detection Platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-200">
                                    Username or Email
                                </Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username or email"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-200">
                                    Password
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                        className="border-slate-700"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm text-slate-400 cursor-pointer select-none"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900/80 px-2 text-slate-400">New to TopoShape?</span>
                            </div>
                        </div>

                        <Link to="/register">
                            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800/50">
                                Create an Account
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
