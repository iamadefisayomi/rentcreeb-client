"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserRound,
  Home,
  Wrench,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  MapPin,
  Mail,
  Phone,
  X,
  Calendar,
  MessageSquare,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type WaitlistUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  city: string;
  iAm: string;
  interest: string[];
  message?: string;
  createdAt: string;
};

type Stats = {
  total: number;
  landlords: number;
  renters: number;
  artisans: number;
  developers: number;
};

type RoleStyle = { badge: string; ring: string };

const ROLE_STYLES: Record<string, RoleStyle> = {
  landlord: {
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
    ring: "from-blue-500 to-blue-600",
  },
  "renter / tenant": {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    ring: "from-emerald-500 to-emerald-600",
  },
  "artisan / service provider": {
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    ring: "from-amber-500 to-amber-600",
  },
  "property developer": {
    badge: "bg-violet-50 text-violet-700 ring-violet-600/20",
    ring: "from-violet-500 to-violet-600",
  },
};

function roleStyle(iAm: string) {
  return (
    ROLE_STYLES[iAm?.toLowerCase()] || {
      badge: "bg-slate-100 text-slate-700 ring-slate-500/20",
      ring: "from-slate-400 to-slate-500",
    }
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function WaitlistDashboard() {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    landlords: 0,
    renters: 0,
    artisans: 0,
    developers: 0,
  });

  const [states, setStates] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [state, setState] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] =
    useState<WaitlistUser | null>(null);

  const fetchWaitlist = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "20");

      if (search) params.set("search", search);
      if (role !== "all") params.set("role", role);
      if (state !== "all") params.set("state", state);

      const response = await fetch(
        `/api/admin/waitlist?${params.toString()}`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Failed to load waitlist");

      const data = await response.json();

      setUsers(data.users || []);
      setStats(data.stats);
      setStates(data.states || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, search, role, state]);

  useEffect(() => {
    fetchWaitlist();
  }, [fetchWaitlist]);

  function resetFilters() {
    setSearch("");
    setRole("all");
    setState("all");
    setPage(1);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function getRoleLabel(value: string) {
    return value
      .replaceAll(" / ", " / ")
      .replaceAll(" service provider", "")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const hasActiveFilters =
    search || role !== "all" || state !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 p-4 md:p-8">
      <div className="mx-auto max-w-8xl space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              RentCreeb Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Waitlist
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor RentCreeb 2.0 early access signups.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="link"
              onClick={fetchWaitlist}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 size-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>

            {/* <Button
              onClick={() =>
                window.open("/api/admin/waitlist/export", "_blank")
              }
              className="shadow-sm"
            >
              <Download className="mr-2 size-4" />
              Export CSV
            </Button> */}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Signups"
            value={stats.total}
            icon={<Users className="size-5" />}
            gradient="from-slate-700 to-slate-900"
          />

          <StatCard
            title="Landlords"
            value={stats.landlords}
            icon={<Home className="size-5" />}
            gradient="from-blue-500 to-blue-600"
          />

          <StatCard
            title="Renters"
            value={stats.renters}
            icon={<UserRound className="size-5" />}
            gradient="from-emerald-500 to-emerald-600"
          />

          <StatCard
            title="Artisans"
            value={stats.artisans}
            icon={<Wrench className="size-5" />}
            gradient="from-amber-500 to-amber-600"
          />

          <StatCard
            title="Developers"
            value={stats.developers}
            icon={<Building2 className="size-5" />}
            gradient="from-violet-500 to-violet-600"
          />
        </div>

        {/* Filters */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, phone or city..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>

              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full lg:w-[220px]">
                  <SelectValue placeholder="All users" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  <SelectItem value="landlord">Landlords</SelectItem>
                  <SelectItem value="renter / tenant">
                    Renters / Tenants
                  </SelectItem>
                  <SelectItem value="artisan / service provider">
                    Artisans
                  </SelectItem>
                  <SelectItem value="property developer">
                    Developers
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={state}
                onValueChange={(value) => {
                  setState(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full lg:w-[200px]">
                  <SelectValue placeholder="All states" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  {states.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={resetFilters}>
                  <X className="mr-2 size-4" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b bg-slate-50/60">
            <CardTitle className="text-base font-semibold">
              Waitlist Members
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {stats.total.toLocaleString()} total
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-slate-50/80">
                  <tr className="text-left">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <LoadingRows />
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-20 text-center"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
                            <Users className="size-5 text-slate-400" />
                          </div>
                          <p className="font-medium text-slate-600">
                            No waitlist members found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const style = roleStyle(user.iAm);
                      return (
                        <tr
                          key={user._id}
                          className="transition-colors hover:bg-slate-50/80"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${style.ring} text-xs font-semibold text-white shadow-sm`}
                              >
                                {initials(user.name)}
                              </div>
                              <p className="font-semibold text-slate-800">
                                {user.name}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="flex items-center gap-2 text-slate-700">
                                <Mail className="size-3.5 text-muted-foreground" />
                                {user.email}
                              </p>
                              <p className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="size-3.5" />
                                {user.phone}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
                            >
                              {getRoleLabel(user.iAm)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-700">
                              <MapPin className="size-4 text-muted-foreground" />
                              <span>
                                {user.city}, {user.state}
                              </span>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </td>

                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedUser(user)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t bg-slate-50/40 p-4">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-medium text-slate-700">{page}</span> of{" "}
                <span className="font-medium text-slate-700">{totalPages}</span>
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User details */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                      roleStyle(selectedUser.iAm).ring
                    } text-sm font-semibold text-white shadow-sm`}
                  >
                    {initials(selectedUser.name)}
                  </div>
                  <div>
                    <DialogTitle className="text-lg">
                      {selectedUser.name}
                    </DialogTitle>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        roleStyle(selectedUser.iAm).badge
                      }`}
                    >
                      {getRoleLabel(selectedUser.iAm)}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Contact */}
                <div className="grid gap-4 rounded-xl border bg-slate-50/60 p-4 sm:grid-cols-2">
                  <InfoItem label="Email" value={selectedUser.email} />
                  <InfoItem label="Phone" value={selectedUser.phone} />
                  <InfoItem label="State" value={selectedUser.state} />
                  <InfoItem label="LGA" value={selectedUser.lga} />
                  <InfoItem label="City" value={selectedUser.city} />
                  <InfoItem
                    label="Joined"
                    value={formatDate(selectedUser.createdAt)}
                  />
                </div>

                {/* Interests */}
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Tag className="size-3.5" />
                    Areas of Interest
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {selectedUser.interest?.length ? (
                      selectedUser.interest.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No interests selected.
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <MessageSquare className="size-3.5" />
                    Message
                  </h3>

                  <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {selectedUser.message || "No message provided."}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ----------------------------------------
   Statistics Card
----------------------------------------- */

function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <Card className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------------------------------
   Info Item
----------------------------------------- */

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

/* ----------------------------------------
   Loading Rows
----------------------------------------- */

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: 6 }).map((_, column) => (
            <td key={column} className="px-6 py-5">
              <div className="h-4 w-full max-w-[160px] animate-pulse rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}