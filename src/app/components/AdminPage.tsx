import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import { SchoolService, UserService } from "../../lib/database";

type SchoolRow = {
  id: string;
  name: string;
};

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "staff" | "admin";
  school_id: string | null;
  student_id: string | null;
  grade: string | null;
  created_at: string;
};

export function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [school, setSchool] = useState<SchoolRow | null>(null);
  const [members, setMembers] = useState<UserRow[]>([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          toast.error("Please sign in again");
          return;
        }

        const profile = await UserService.getUserByAuthId(user.id);
        if (!profile) {
          toast.error("User profile not found");
          return;
        }

        if (profile.role !== "admin") {
          toast.error("Admin access required");
          return;
        }

        const schoolRow = await SchoolService.getSchoolById(profile.school_id);
        const users = await UserService.getUsersBySchool(profile.school_id);

        if (!isMounted) return;

        setSchool(schoolRow as SchoolRow);
        setMembers((users as UserRow[]) ?? []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load admin dashboard";
        toast.error(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const copyJoinCode = async () => {
    if (!school?.id) return;
    try {
      await navigator.clipboard.writeText(school.id);
      toast.success("Join code copied");
    } catch {
      toast.error("Failed to copy join code");
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1
            className="mb-2 text-white"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "2.5rem",
            }}
          >
            Admin Dashboard
          </h1>
          <p className="text-gray-300 text-lg">School settings and member management</p>
        </div>

        {isLoading && (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg">Loading admin dashboard...</p>
          </div>
        )}

        {!isLoading && school && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm">School</div>
                  <div className="text-white text-xl font-semibold">{school.name}</div>
                </div>

                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <div className="text-blue-200 text-sm">Student Join Code</div>
                  <div className="text-white text-3xl font-bold tracking-widest mt-1">{school.id}</div>
                  <div className="text-gray-400 text-xs mt-2">
                    Join codes cannot be regenerated.
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
                  onClick={copyJoinCode}
                >
                  Copy join code
                </Button>
              </div>
            </Card>

            <Card className="lg:col-span-2 p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white font-semibold">Members</div>
                <div className="text-gray-400 text-sm">{members.length} total</div>
              </div>

              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl border border-white/5 bg-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-white font-semibold truncate">{m.full_name}</div>
                        <div className="text-gray-400 text-sm truncate">{m.email}</div>
                        {(m.student_id || m.grade) && (
                          <div className="text-gray-500 text-xs">
                            {m.student_id ? `ID: ${m.student_id}` : ""}
                            {m.student_id && m.grade ? " • " : ""}
                            {m.grade ? `Grade: ${m.grade}` : ""}
                          </div>
                        )}
                      </div>
                      <div className="text-xs px-2 py-1 rounded border border-white/10 text-gray-300">
                        {m.role}
                      </div>
                    </div>
                  </div>
                ))}

                {members.length === 0 && (
                  <div className="text-gray-400 text-sm">No members found.</div>
                )}
              </div>
            </Card>
          </div>
        )}

        {!isLoading && !school && (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg">School not found for this admin account.</p>
          </div>
        )}
      </div>
    </div>
  );
}
