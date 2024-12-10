export interface UserProfile {
    match_id: number;
    target_id: string;
    user_ids: string[];
    sub_account: string;
    match_created_at: string;
    match_administrator: string;
    profile_id: number;
    profile_user_id: string;
    nickname: string;
    profile_created_at: string;
    age: number;
    birthday: string | null;
    height: number;
    sex: number;
    address: string | null;
    interests: Interest[] | null;
    bio: string;
    photos: (string | null)[];
    kyc: string | null;
    city: string;
    balance: number;
    is_vip: boolean;
    is_verified: boolean;
    administrator: string | null;
    focus: number;
}

export interface Interest {
    cn: string;
    en: string;
    id: number;
    kor: string;
    created_at: string;
}
