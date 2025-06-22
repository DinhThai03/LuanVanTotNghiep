export enum RoomType {
    LT = "LT",
    TH = "TH",
}

export interface RoomData {
    id: number;
    name: string;
    size: number;
    room_type: RoomType;
    is_active: number;
}
