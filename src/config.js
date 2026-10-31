// All backend endpoints in one place.
//
// The backend currently has NO endpoints for approving / rejecting craftsmen or
// suspending / activating accounts, so those are `null`. While they are null the
// dashboard saves the decision in this browser only (localStorage).
//
// When the backend adds them, replace `null` with a function that returns the request, e.g.:
//   approve: (c) => ({ path: `/user/${c.id}/verification`, method: 'PATCH', body: { verificationStatus: 'Approved' } }),
//   reject:  (c) => ({ path: `/user/${c.id}/verification`, method: 'PATCH', body: { verificationStatus: 'Rejected' } }),
//   suspend: (a) => ({ path: `/user/${a.id}/status`, method: 'PATCH', body: { status: 'Suspended' } }),
//   activate:(a) => ({ path: `/user/${a.id}/status`, method: 'PATCH', body: { status: 'Active' } }),
export const ENDPOINTS = {
  list: '/user/all-users',
  approve: null,
  reject: null,
  suspend: null,
  activate: null,
};
