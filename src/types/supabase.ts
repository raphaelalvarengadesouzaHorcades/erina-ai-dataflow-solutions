// ⚠️ Arquivo gerado automaticamente
// Gerado em: 2026-07-26T00:14:05.993Z

export interface ProfilesRow {
    id: string;
    role: string | null;
    full_name: string | null;
    avatar_url: any | null;
    cargo: any | null;
    created_at: string | null;
    department: any | null;
    phone: any | null;
    notification_preferences: Record<string, any> | null;
}

export interface WorkSessionsRow {
    id: string;
    user_id: string | null;
    started_at: string | null;
    ended_at: any | null;
    status: string | null;
}

export interface PausesRow {
    id: string;
    session_id: string | null;
    user_id: string | null;
    started_at: string | null;
    ended_at: string | null;
    type: string | null;
    is_emergency: boolean | null;
}

export interface DemandsRow {
    id: string;
    created_at: string | null;
}

export interface ChatMessagesRow {
    id: string;
    user_id: string | null;
    role: string | null;
    content: string | null;
    created_at: string | null;
}

export interface UserConnectionsRow {
    id: string;
    created_at: string | null;
}

export interface EmailsRow {
    id: string;
    created_at: string | null;
}

export interface WhatsappMessagesRow {
    id: string;
    created_at: string | null;
}

export interface PauseSummariesRow {
    id: string;
    created_at: string | null;
}

export interface ApiDocumentationRow {
    id: string;
    title: string | null;
    endpoint: string | null;
    method: string | null;
    description: string | null;
    parameters: any[] | null;
    responses: Record<string, any> | null;
    category: string | null;
    is_public: boolean | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface CompaniesRow {
    id: string;
    name: string | null;
    slug: string | null;
    logo_url: any | null;
    primary_color: string | null;
    settings: Record<string, any> | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface CompanyMembersRow {
    id: string;
    created_at: string | null;
}
