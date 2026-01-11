import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { validatePassword } from "@/lib/auth";

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const validation = validatePassword(password);

    if (!password) return null;

    const strengthColors = {
        weak: "bg-red-500",
        medium: "bg-yellow-500",
        strong: "bg-green-500",
    };

    const strengthWidth = {
        weak: "w-1/3",
        medium: "w-2/3",
        strong: "w-full",
    };

    const requirements = [
        { text: "At least 8 characters", test: password.length >= 8 },
        { text: "One uppercase letter", test: /[A-Z]/.test(password) },
        { text: "One lowercase letter", test: /[a-z]/.test(password) },
        { text: "One number", test: /[0-9]/.test(password) },
        { text: "One special character", test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    return (
        <div className="space-y-2 mt-2">
            {/* Strength Bar */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${strengthColors[validation.strength]}`}
                        initial={{ width: 0 }}
                        animate={{ width: validation.strength === 'weak' ? '33%' : validation.strength === 'medium' ? '66%' : '100%' }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <span className="text-xs font-medium capitalize">{validation.strength}</span>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-1">
                {requirements.map((req, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 text-xs"
                    >
                        {req.test ? (
                            <Check className="w-3 h-3 text-green-500" />
                        ) : (
                            <X className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span className={req.test ? "text-green-500" : "text-muted-foreground"}>
                            {req.text}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
