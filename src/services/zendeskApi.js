/**
 * Zendesk API Service Layer
 *
 * Provides secure API integration with Zendesk Support API
 * using Basic Authentication with API tokens.
 *
 * @see https://developer.zendesk.com/api-reference/
 */

/**
 * Creates the Basic Auth header for Zendesk API requests
 *
 * @param {string} email - User's email address
 * @param {string} apiToken - Zendesk API token
 * @returns {string} Base64 encoded auth string
 */
const createAuthHeader = (email, apiToken) => {
  const authString = `${email}/token:${apiToken}`;
  return `Basic ${btoa(authString)}`;
};

/**
 * Constructs the base URL for Zendesk API
 *
 * @param {string} subdomain - Zendesk subdomain (e.g., "mycompany")
 * @returns {string} Base URL for API requests
 */
const getBaseUrl = (subdomain) => {
  return `https://${subdomain}.zendesk.com/api/v2`;
};

/**
 * Makes an authenticated request to the Zendesk API
 *
 * @param {string} subdomain - Zendesk subdomain
 * @param {string} email - User's email
 * @param {string} apiToken - API token
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<Object>} API response data
 * @throws {Error} If request fails or returns non-OK status
 */
const makeApiRequest = async (subdomain, email, apiToken, endpoint) => {
  const baseUrl = getBaseUrl(subdomain);
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': createAuthHeader(email, apiToken),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Please check your internet connection and ensure the subdomain is correct');
    }
    throw error;
  }
};

/**
 * Zendesk API client object
 */
const zendeskApi = {
  /**
   * Validates credentials by making a test request
   *
   * @param {string} subdomain - Zendesk subdomain
   * @param {string} email - User's email
   * @param {string} apiToken - API token
   * @returns {Promise<Object>} User information if credentials are valid
   * @throws {Error} If credentials are invalid
   */
  validateCredentials: async (subdomain, email, apiToken) => {
    return makeApiRequest(subdomain, email, apiToken, '/users/me.json');
  },

  /**
   * Fetches a list of tickets with pagination
   *
   * @param {string} subdomain - Zendesk subdomain
   * @param {string} email - User's email
   * @param {string} apiToken - API token
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} Tickets data with pagination info
   */
  getTickets: async (subdomain, email, apiToken, page = 1) => {
    const perPage = 30;
    const offset = (page - 1) * perPage;
    return makeApiRequest(
      subdomain,
      email,
      apiToken,
      `/tickets.json?page=${page}&per_page=${perPage}`
    );
  },

  /**
   * Fetches details for a specific ticket including comments
   *
   * @param {string} subdomain - Zendesk subdomain
   * @param {string} email - User's email
   * @param {string} apiToken - API token
   * @param {number} ticketId - Ticket ID
   * @returns {Promise<Object>} Ticket details with comments
   */
  getTicketDetails: async (subdomain, email, apiToken, ticketId) => {
    const [ticketResponse, commentsResponse] = await Promise.all([
      makeApiRequest(subdomain, email, apiToken, `/tickets/${ticketId}.json`),
      makeApiRequest(subdomain, email, apiToken, `/tickets/${ticketId}/comments.json`)
    ]);

    return {
      ticket: ticketResponse.ticket,
      comments: commentsResponse.comments
    };
  },

  /**
   * Searches tickets using Zendesk search API
   *
   * @param {string} subdomain - Zendesk subdomain
   * @param {string} email - User's email
   * @param {string} apiToken - API token
   * @param {Object} filters - Search filters
   * @param {string} filters.status - Ticket status filter
   * @param {string} filters.priority - Priority filter
   * @param {string} filters.query - Search query string
   * @returns {Promise<Object>} Search results
   */
  searchTickets: async (subdomain, email, apiToken, filters) => {
    const searchParams = [];

    // Add type:ticket to search only tickets
    searchParams.push('type:ticket');

    if (filters.status && filters.status !== 'all') {
      searchParams.push(`status:${filters.status}`);
    }

    if (filters.priority && filters.priority !== 'all') {
      searchParams.push(`priority:${filters.priority}`);
    }

    if (filters.query && filters.query.trim()) {
      searchParams.push(`subject:${filters.query.trim()}`);
    }

    const searchQuery = searchParams.join(' ');
    const encodedQuery = encodeURIComponent(searchQuery);

    return makeApiRequest(
      subdomain,
      email,
      apiToken,
      `/search.json?query=${encodedQuery}`
    );
  },

  /**
   * Fetches user information by user ID
   *
   * @param {string} subdomain - Zendesk subdomain
   * @param {string} email - User's email
   * @param {string} apiToken - API token
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User information
   */
  getUser: async (subdomain, email, apiToken, userId) => {
    return makeApiRequest(subdomain, email, apiToken, `/users/${userId}.json`);
  }
};

export default zendeskApi;
