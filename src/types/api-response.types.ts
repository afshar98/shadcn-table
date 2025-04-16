import { User } from "./user.types";

export interface ApiResponse {
  data: {
    count: number;
    rows: User[];
  };
}
