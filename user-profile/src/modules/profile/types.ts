export type ActivityStatus = "completed" | "in-progress" | "blocked";

export interface Profile<TTag extends string = string> {
  id: string;
  fullName: string;
  role: string;
  location: string;
  bio: string;
  avatarUrl: string;
  completion: number;
  tags: TTag[];
}

export interface Insight<TMeta extends object = Record<string, never>> {
  id: string;
  label: string;
  value: string | number;
  delta: number;
  meta: TMeta;
}

export interface Activity {
  id: string;
  title: string;
  summary: string;
  time: string;
  status: ActivityStatus;
}

export interface DashboardData<
  TTag extends string,
  TInsightMeta extends object,
> {
  profile: Profile<TTag>;
  insights: Insight<TInsightMeta>[];
  activities: Activity[];
}
