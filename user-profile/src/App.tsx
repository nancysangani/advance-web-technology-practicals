import { useEffect, useMemo, useState } from "react";
import { ProfileDashboard } from "./modules/profile/ProfileDashboard";
import {
  useDashboardData,
  useDashboardUsers,
} from "./modules/profile/useDashboardData";
import "./App.css";

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number>(1);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const {
    users,
    isLoading: usersLoading,
    error: usersError,
  } = useDashboardUsers(10);
  const { data, isLoading, error, refresh } = useDashboardData(selectedUserId);

  useEffect(() => {
    if (users.length === 0) return;

    const exists = users.some((user) => user.id === selectedUserId);
    if (!exists) {
      setSelectedUserId(users[0].id);
      setActiveTag(null);
    }
  }, [selectedUserId, users]);

  const filteredData = useMemo(() => {
    if (!data || !activeTag) return data;

    return {
      ...data,
      activities: data.activities.filter((activity) =>
        [activity.title, activity.summary]
          .join(" ")
          .toLowerCase()
          .includes(activeTag.toLowerCase()),
      ),
    };
  }, [activeTag, data]);

  const selectedUserLabel =
    users.find((user) => user.id === selectedUserId)?.label ??
    `User #${selectedUserId}`;

  const userPicker = (
    <div className="top-controls">
      <label className="user-picker" htmlFor="profile-user-picker">
        <span>User</span>
        <select
          id="profile-user-picker"
          value={selectedUserId}
          disabled={usersLoading || users.length === 0}
          onChange={(event) => {
            setSelectedUserId(Number(event.target.value));
            setActiveTag(null);
          }}
        >
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.label}
              </option>
            ))
          ) : (
            <option value={selectedUserId}>User #{selectedUserId}</option>
          )}
        </select>
        {usersError ? (
          <small className="picker-note">
            Using fallback IDs (user list unavailable).
          </small>
        ) : null}
      </label>
      <button type="button" className="retry-btn" onClick={() => refresh()}>
        Refresh
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="app-state" aria-live="polite">
        <section className="state-card">
          {userPicker}
          <h1>Loading live dashboard...</h1>
          <p>
            Fetching profile, insights, and activity for {selectedUserLabel}.
          </p>
        </section>
      </div>
    );
  }

  if (error || !filteredData) {
    return (
      <div className="app-state" aria-live="polite">
        <section className="state-card">
          {userPicker}
          <h1>Could not load dashboard</h1>
          <p>{error ?? "No dashboard data returned."}</p>
          <button type="button" className="retry-btn" onClick={() => refresh()}>
            Retry
          </button>
        </section>
      </div>
    );
  }

  return (
    <>
      {userPicker}
      <ProfileDashboard
        data={filteredData}
        activeTag={activeTag}
        onTagSelect={(tag) =>
          setActiveTag((current) => (current === tag ? null : tag))
        }
        renderInsightMeta={(meta) => (
          <>
            <span>Target: {meta.target}</span>
            <span>Source: {meta.source}</span>
          </>
        )}
      />
      <p className="filter-note">
        Viewing: <strong>{selectedUserLabel}</strong> | Active Filter:{" "}
        <strong>{activeTag ?? "None"}</strong>
      </p>
    </>
  );
}

export default App;
