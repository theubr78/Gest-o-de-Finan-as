'use client';

/**
 * Skeleton loader para dashboard
 */
export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-32" />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="skeleton h-96" />
                <div className="skeleton h-96" />
            </div>
        </div>
    );
}
