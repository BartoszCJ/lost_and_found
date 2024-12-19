export const API_BASE_URL = 'http://localhost:3001';

export const ENDPOINTS = {
  LOGIN: '/api/users/login',
  ITEMS: '/api/items',
  LOST_REPORTS: '/api/lost-reports',
  OWNERSHIP_CLAIMS: '/api/ownership-claims',
};

export const USER_ROLES = {
  USER: 'user',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
} as const;

export const ITEM_STATUSES = {
  UNCONFIRMED: 'unconfirmed',
  FOUND: 'found',
  CLAIMED: 'claimed',
} as const;

export const CLAIM_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
