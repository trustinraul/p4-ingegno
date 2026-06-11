export type ProfileLinkType =
  | 'github'
  | 'x'
  | 'linkedin'
  | 'instagram'
  | 'youtube'
  | 'website'
  | 'custom'

export interface ProfileLink {
  type: ProfileLinkType
  label: string
  url: string
}

export interface Profile {
  id: string
  username: string
  full_name: string | null
  tagline: string | null
  roles: string[]
  narrative: string | null
  avatar_url: string | null
  links: ProfileLink[]
  contact_email: string | null
  is_public: boolean
  plan: 'free' | 'pro'
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  status: 'in_progress' | 'launched'
  url: string | null
  cover_image_url: string | null
  display_order: number
  created_at: string
}

export interface Update {
  id: string
  user_id: string
  project_id: string | null
  content: string
  image_url: string | null
  created_at: string
}

export interface GithubActivity {
  id: string
  user_id: string
  repo_name: string
  commit_message: string
  commit_sha: string
  committed_at: string
}

export interface ActivityItem {
  id: string
  type: 'github_commit' | 'manual_update'
  content: string
  repo_name?: string
  image_url?: string
  created_at: string
}
