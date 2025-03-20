/*PAGE DE DASHBOARD*/
/*Cette page permet aux membres de voir les statistiques et de gérer leur compte*/

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { DashboardStats } from '@/hooks/useDashboardStats';

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1EAEDB] mx-auto" />
          <h1 className="text-4xl font-bold text-[#1EAEDB] mt-4">Loading Dashboard...</h1>
          <p className="text-[#FEF7CD] mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? (
              error.message === "2FA verification required" ? (
                <>
                  Two-factor authentication is required.
                  <br />
                  <a href="/verify-otp" className="text-[#1EAEDB] hover:underline">
                    Click here to verify your identity
                  </a>
                </>
              ) : error.message === "Unauthorized. Active membership required." ? (
                <>
                  You need an active membership to access the dashboard.
                  <br />
                  <a href="/membership" className="text-[#1EAEDB] hover:underline">
                    Click here to become a member
                  </a>
                </>
              ) : error.message === "Not authenticated" ? (
                <>
                  Please sign in to access the dashboard.
                  <br />
                  <a href="/signin" className="text-[#1EAEDB] hover:underline">
                    Click here to sign in
                  </a>
                </>
              ) : (
                error.message
              )
            ) : (
              "Failed to load dashboard data. Please try again later."
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Utiliser un objet stats par défaut si aucune donnée n'est disponible
  const defaultStats: DashboardStats = {
    total_articles: 0,
    total_events: 0,
    total_projects: 0,
    personal_stats: {
      my_articles: 0,
      my_events: 0,
      my_donations: [],
      membership_status: {
        is_active: false,
        last_payment: null
      }
    },
    recent_activities: {
      articles: [],
      events: [],
      projects: []
    }
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">Dashboard</h1>
        <p className="text-[#FEF7CD] text-lg max-w-2xl mx-auto">
          Welcome to your personal dashboard. Here you can view your statistics and manage your account.
        </p>
      </div>

      {/* Membership Status */}
      <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20 mb-8">
        <CardHeader>
          <CardTitle className="text-[#1EAEDB] text-xl">Membership Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">
                Status: <span className={displayStats.personal_stats?.membership_status?.is_active ? "text-green-500" : "text-red-500"}>
                  {displayStats.personal_stats?.membership_status?.is_active ? "Active" : "Inactive"}
                </span>
              </p>
              {displayStats.personal_stats?.membership_status?.last_payment && (
                <p className="text-[#FEF7CD] text-sm">
                  Last Payment: {new Date(displayStats.personal_stats.membership_status.last_payment.creation_time).toLocaleDateString()}
                </p>
              )}
            </div>
            {!displayStats.personal_stats?.membership_status?.is_active && (
              <a href="/membership" className="text-[#1EAEDB] hover:underline">
                Renew Membership
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader>
            <CardTitle className="text-[#1EAEDB] text-xl">My Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{displayStats.personal_stats?.my_articles ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader>
            <CardTitle className="text-[#1EAEDB] text-xl">My Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{displayStats.personal_stats?.my_events ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader>
            <CardTitle className="text-[#1EAEDB] text-xl">My Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{displayStats.personal_stats?.my_donations?.length ?? 0}</p>
            <p className="text-[#FEF7CD] text-sm mt-2">Feature coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader>
            <CardTitle className="text-[#1EAEDB] text-xl">Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(displayStats.recent_activities?.articles?.length ?? 0) > 0 ? (
                displayStats.recent_activities.articles.map((article) => (
                  <div key={article.id} className="p-3 bg-[#2A2F3C] rounded-lg">
                    <h3 className="text-white font-semibold">{article.title}</h3>
                    <p className="text-[#FEF7CD] text-sm">
                      {new Date(article.creation_time).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#FEF7CD] text-sm">No recent articles</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader>
            <CardTitle className="text-[#1EAEDB] text-xl">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(displayStats.recent_activities?.events?.length ?? 0) > 0 ? (
                displayStats.recent_activities.events.map((event) => (
                  <div key={event.id} className="p-3 bg-[#2A2F3C] rounded-lg">
                    <h3 className="text-white font-semibold">{event.title}</h3>
                    <p className="text-[#FEF7CD] text-sm">
                      {new Date(event.start_datetime).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#FEF7CD] text-sm">No recent events</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader>
            <CardTitle className="text-[#1EAEDB] text-xl">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(displayStats.recent_activities?.projects?.length ?? 0) > 0 ? (
                displayStats.recent_activities.projects.map((project) => (
                  <div key={project.id} className="p-3 bg-[#2A2F3C] rounded-lg">
                    <h3 className="text-white font-semibold">{project.title}</h3>
                    <p className="text-[#FEF7CD] text-sm">Budget: ${project.budget}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#FEF7CD] text-sm">No recent projects</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Statistics */}
      {isAdmin() && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#1EAEDB] mb-6">Admin Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
              <CardHeader>
                <CardTitle className="text-[#1EAEDB] text-xl">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{displayStats.total_users ?? 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
              <CardHeader>
                <CardTitle className="text-[#1EAEDB] text-xl">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{displayStats.total_members ?? 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
              <CardHeader>
                <CardTitle className="text-[#1EAEDB] text-xl">Monthly Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">
                  ${(displayStats.donations_stats?.monthly_amount ?? 0).toFixed(2)}
                </p>
                <p className="text-[#FEF7CD] text-sm mt-2">Payment system coming soon</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
              <CardHeader>
                <CardTitle className="text-[#1EAEDB] text-xl">New Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">
                  {displayStats.user_growth?.monthly_new_members ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 