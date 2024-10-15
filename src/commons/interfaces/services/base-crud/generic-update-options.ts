export interface GenericUpdateOptions {
    id: number;
    data: Partial<any>;
    connectedUserId?: string;
    include?: any;
    select?: any;
}
