export interface PromotionDetails {
  name: string;
  discountType: string;
  discountAmount: number;
  roomNumber?: string;
  roomType?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}
