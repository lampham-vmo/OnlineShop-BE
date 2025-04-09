export interface AccountData {
    id: number;
    fullName: string;
    email: string;
    role: string;
    status: boolean;
    createdAt: Date;
}

export interface AccountRO {
    account: AccountData;
}

export interface AccountsRO {
    accounts: AccountData[];
    accountsCount: number;
}
