import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus("success");
                    setMessage("Your email has been successfully verified!");
                } else {
                    setStatus("error");
                    setMessage(data.detail || "Verification failed. The link may be expired.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("An error occurred while verifying your email.");
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl text-center"
            >
                <div className="flex justify-center mb-6">
                    {status === "loading" && (
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    )}
                    {status === "success" && (
                        <div className="p-4 bg-green-500/10 rounded-full">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                    )}
                    {status === "error" && (
                        <div className="p-4 bg-destructive/10 rounded-full">
                            <XCircle className="w-8 h-8 text-destructive" />
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold mb-2">
                    {status === "loading" && "Verifying Email"}
                    {status === "success" && "Email Verified"}
                    {status === "error" && "Verification Failed"}
                </h1>

                <p className="text-muted-foreground mb-8">
                    {message}
                </p>

                {status !== "loading" && (
                    <Link to="/login">
                        <Button className="w-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Button>
                    </Link>
                )}
            </motion.div>
        </div>
    );
}
