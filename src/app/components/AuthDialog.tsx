import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Mode = "sign_in" | "sign_up";
type SignUpRole = "student" | "administrator";
type SignUpStep = "role_selection" | "school_info" | "account_creation";

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<Mode>("sign_in");
  const [signUpRole, setSignUpRole] = useState<SignUpRole>("student");
  const [signUpStep, setSignUpStep] = useState<SignUpStep>("role_selection");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [studentId, setStudentId] = useState("");
  const [grade, setGrade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setMode("sign_in");
      setPassword("");
      setSignUpStep("role_selection");
      setSignUpRole("student");
      setSchoolName("");
      setSchoolCode("");
      setStudentId("");
      setGrade("");
    }
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        toast.success("Successfully signed in");
        onOpenChange(false);
        return;
      }

      // Sign up process
      if (signUpStep === "role_selection") {
        setSignUpStep("school_info");
        return;
      }

      if (signUpStep === "school_info") {
        // Validate school info
        if (!schoolName || !schoolCode) {
          toast.error("Please provide school name and join code");
          return;
        }

        if (signUpRole === "student" && (!studentId || !grade)) {
          toast.error("Please provide student ID and grade");
          return;
        }

        setSignUpStep("account_creation");
        return;
      }

      // Final account creation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: signUpRole,
            school_name: schoolName,
            school_code: schoolCode,
            student_id: signUpRole === "student" ? studentId : null,
            grade: signUpRole === "student" ? grade : null,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Account created and signed in");
        onOpenChange(false);
      } else {
        toast.success("Account created", {
          description:
            "Check your email to confirm your account, then sign in.",
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-white/20 text-white shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle
            className="text-white-400 mb-2"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "2rem",
              fontWeight: "600",
            }}
          >
            {mode === "sign_in" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-base leading-relaxed">
            {mode === "sign_in"
              ? "Sign in to view listings, report items, and claim your belongings."
              : "Create your account to start using Findr."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
              mode === "sign_in"
                ? "text-white relative overflow-hidden group"
                : "text-white/60 border border-white/20 hover:bg-white/10"
            }`}
            style={{
              ...(mode === "sign_in" && {
                background:
                  "linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)",
                boxShadow:
                  "0 4px 24px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
              }),
            }}
            onClick={() => setMode("sign_in")}
            onMouseEnter={(e) => {
              if (mode === "sign_in") {
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (mode === "sign_in") {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {mode === "sign_in" && (
              <span
                className="ripple-effect absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(147,197,253,0.3) 40%, rgba(96,165,250,0.2) 60%, transparent 80%)",
                  transform: "scale(0)",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
            )}
            <span className="relative z-10">Sign In</span>
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
              mode === "sign_up"
                ? "text-white relative overflow-hidden group"
                : "text-white/60 border border-white/20 hover:bg-white/10"
            }`}
            style={{
              ...(mode === "sign_up" && {
                background:
                  "linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)",
                boxShadow:
                  "0 4px 24px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
              }),
            }}
            onClick={() => setMode("sign_up")}
            onMouseEnter={(e) => {
              if (mode === "sign_up") {
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (mode === "sign_up") {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {mode === "sign_up" && (
              <span
                className="ripple-effect absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(147,197,253,0.3) 40%, rgba(96,165,250,0.2) 60%, transparent 80%)",
                  transform: "scale(0)",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
            )}
            <span className="relative z-10">Sign Up</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "sign_up" && signUpStep === "role_selection" && (
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold text-white mb-4"
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                How would you like to sign up?
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSignUpRole("student")}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                    signUpRole === "student"
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        signUpRole === "student"
                          ? "border-blue-500"
                          : "border-white/40"
                      }`}
                    >
                      {signUpRole === "student" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">Student</div>
                      <div className="text-sm text-white/60">
                        Report lost items and claim your belongings
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSignUpRole("administrator")}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                    signUpRole === "administrator"
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        signUpRole === "administrator"
                          ? "border-blue-500"
                          : "border-white/40"
                      }`}
                    >
                      {signUpRole === "administrator" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        Administrator
                      </div>
                      <div className="text-sm text-white/60">
                        Manage lost & found for your school
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {mode === "sign_up" && signUpStep === "school_info" && (
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold text-white mb-4"
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                School Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-white font-medium">
                  School Name
                </Label>
                <Input
                  id="schoolName"
                  placeholder="e.g., Lincoln High School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolCode" className="text-white font-medium">
                  School Join Code
                </Label>
                <Input
                  id="schoolCode"
                  placeholder="Enter your school's unique join code"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                />
              </div>

              {signUpRole === "student" && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="studentId"
                      className="text-white font-medium"
                    >
                      Student ID
                    </Label>
                    <Input
                      id="studentId"
                      placeholder="e.g., 2024001234"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-white font-medium">
                      Grade Level
                    </Label>
                    <select
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border-white/10 text-white focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      required
                    >
                      <option value="" className="bg-gray-800">
                        Select your grade
                      </option>
                      <option value="9" className="bg-gray-800">
                        9th Grade
                      </option>
                      <option value="10" className="bg-gray-800">
                        10th Grade
                      </option>
                      <option value="11" className="bg-gray-800">
                        11th Grade
                      </option>
                      <option value="12" className="bg-gray-800">
                        12th Grade
                      </option>
                      <option value="other" className="bg-gray-800">
                        Other
                      </option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {mode === "sign_up" && signUpStep === "account_creation" && (
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold text-white mb-4"
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                Create Your Account
              </h3>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="e.g., Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                />
              </div>
            </div>
          )}

          {mode === "sign_in" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-full font-semibold text-base text-white relative overflow-hidden group transition-all duration-300"
            style={{
              background:
                "linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)",
              boxShadow:
                "0 4px 24px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
              transform: "scale(1)",
            }}
            disabled={isSubmitting}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <span
              className="ripple-effect absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(147,197,253,0.3) 40%, rgba(96,165,250,0.2) 60%, transparent 80%)",
                transform: "scale(0)",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <span className="relative z-10">
              {isSubmitting
                ? mode === "sign_in"
                  ? "Signing in..."
                  : signUpStep === "role_selection"
                    ? "Continue"
                    : signUpStep === "school_info"
                      ? "Continue"
                      : "Creating account..."
                : mode === "sign_in"
                  ? "Sign In"
                  : signUpStep === "role_selection"
                    ? "Continue"
                    : signUpStep === "school_info"
                      ? "Continue"
                      : "Create Account"}
            </span>
          </button>

          {mode === "sign_up" && signUpStep !== "role_selection" && (
            <button
              type="button"
              onClick={() => {
                if (signUpStep === "account_creation") {
                  setSignUpStep("school_info");
                } else if (signUpStep === "school_info") {
                  setSignUpStep("role_selection");
                }
              }}
              className="w-full px-6 py-3 rounded-full font-medium text-base text-white/60 border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              Back
            </button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
