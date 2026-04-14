import type { ReactNode } from "react";
import type { Activity, ActivityStatus, DashboardData } from "./types";

interface ProfileDashboardProps<
  TTag extends string,
  TInsightMeta extends object,
> {
  data: DashboardData<TTag, TInsightMeta>;
  activeTag?: TTag | null;
  onTagSelect?: (tag: TTag) => void;
  renderInsightMeta?: (meta: TInsightMeta) => ReactNode;
}

interface CollectionProps<TItem> {
  items: TItem[];
  getKey: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
  className?: string;
}

function Collection<TItem>({
  items,
  getKey,
  renderItem,
  className,
}: CollectionProps<TItem>) {
  return (
    <div className={className}>
      {items.map((item) => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

function statusClass(status: ActivityStatus): string {
  if (status === "completed") return "status status-completed";
  if (status === "in-progress") return "status status-progress";
  return "status status-blocked";
}

function formatDelta(delta: number): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta}%`;
}

export function ProfileDashboard<
  TTag extends string,
  TInsightMeta extends object,
>({
  data,
  activeTag,
  onTagSelect,
  renderInsightMeta,
}: ProfileDashboardProps<TTag, TInsightMeta>) {
  const { profile, insights, activities } = data;

  return (
    <main className="dashboard-shell">
      <header className="profile-hero">
        <img
          src={profile.avatarUrl}
          alt={profile.fullName}
          className="avatar"
        />
        <div className="hero-content">
          <p className="eyebrow">Profile Module</p>
          <h1>{profile.fullName}</h1>
          <p className="role-line">
            {profile.role} <span>{profile.location}</span>
          </p>
          <p className="bio">{profile.bio}</p>
          <div className="tag-list">
            {profile.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag ${activeTag === tag ? "is-active" : ""}`}
                onClick={() => onTagSelect?.(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="completion-card" aria-label="Profile completeness">
          <p>Profile Completeness</p>
          <strong>{profile.completion}%</strong>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={profile.completion}
          >
            <span style={{ width: `${profile.completion}%` }} />
          </div>
        </div>
      </header>

      <section className="insight-grid" aria-label="Performance insights">
        <Collection
          items={insights}
          className="insight-grid-inner"
          getKey={(insight) => insight.id}
          renderItem={(insight) => (
            <article className="insight-card">
              <p>{insight.label}</p>
              <h2>{insight.value}</h2>
              <small
                className={
                  insight.delta >= 0 ? "delta positive" : "delta negative"
                }
              >
                {formatDelta(insight.delta)} vs last week
              </small>
              {renderInsightMeta ? (
                <div className="insight-meta">
                  {renderInsightMeta(insight.meta)}
                </div>
              ) : null}
            </article>
          )}
        />
      </section>

      <section className="activity-panel" aria-label="Recent activity">
        <div className="panel-head">
          <h3>Recent Activity</h3>
          <span>{activities.length} items</span>
        </div>
        <Collection<Activity>
          items={activities}
          className="activity-list"
          getKey={(activity) => activity.id}
          renderItem={(activity) => (
            <article className="activity-item">
              <div>
                <h4>{activity.title}</h4>
                <p>{activity.summary}</p>
              </div>
              <div className="activity-side">
                <span className={statusClass(activity.status)}>
                  {activity.status}
                </span>
                <time>{activity.time}</time>
              </div>
            </article>
          )}
        />
      </section>
    </main>
  );
}
