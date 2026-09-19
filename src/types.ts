export interface DateResponse {
  id: string;
  name: string;
  selectedDays: string[];
  preferredTime: string;
  preferredVibe: string;
  favoriteTreat: string;
  personalMessage: string;
  contactPhone?: string;
  answers?: Record<string, any>;
  timestamp: string;
  timestampFormattedSAST: string;
  createdAt: string;
}

export interface OrganizerConfig {
  organizerName: string;
  organizerPhone: string;
  audioUrl?: string;
  audioTitle?: string;
}

export interface DayOption {
  dayName: string;
  formattedDate: string;
  isWeekend: boolean;
  label: string;
  tag?: string;
}
