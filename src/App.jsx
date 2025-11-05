import { useState, useEffect, useRef } from 'react';
import LoginForm from './components/LoginForm';
import SearchFilters from './components/SearchFilters';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import zendeskApi from './services/zendeskApi';

/**
 * Main App Component
 *
 * Manages application state, credentials, and coordinates between components.
 * Credentials are stored in memory only for security.
 */
function App() {
  // Authentication state - stored in memory only
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Using useRef to store credentials securely in memory (not in state to avoid re-renders)
  const credentialsRef = useRef(null);

  // Tickets state
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [ticketComments, setTicketComments] = useState([]);

  // UI state
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [hasMoreTickets, setHasMoreTickets] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    priority: 'all',
    query: ''
  });

  /**
   * Handles user login and credential validation
   *
   * @param {string} subdomain - Zendesk subdomain
   * @param {string} email - User email
   * @param {string} apiToken - API token
   */
  const handleLogin = async (subdomain, email, apiToken) => {
    try {
      // Validate credentials by fetching current user
      const response = await zendeskApi.validateCredentials(subdomain, email, apiToken);

      // Store credentials in memory (useRef)
      credentialsRef.current = { subdomain, email, apiToken };

      // Set authentication state
      setIsAuthenticated(true);
      setCurrentUser(response.user);

      // Load initial tickets
      await loadTickets(subdomain, email, apiToken, 1);
    } catch (error) {
      throw new Error('Invalid credentials or network error. Please check your details and try again.');
    }
  };

  /**
   * Handles user logout and clears all credentials
   */
  const handleLogout = () => {
    // Clear credentials from memory
    credentialsRef.current = null;

    // Reset all state
    setIsAuthenticated(false);
    setCurrentUser(null);
    setTickets([]);
    setSelectedTicketId(null);
    setTicketDetails(null);
    setTicketComments([]);
    setError(null);
    setHasMoreTickets(true);
    setCurrentPage(1);
    setActiveFilters({ status: 'all', priority: 'all', query: '' });
  };

  /**
   * Loads tickets from Zendesk API
   *
   * @param {string} subdomain - Zendesk subdomain
   * @param {string} email - User email
   * @param {string} apiToken - API token
   * @param {number} page - Page number
   * @param {boolean} append - Whether to append to existing tickets or replace
   */
  const loadTickets = async (subdomain, email, apiToken, page = 1, append = false) => {
    setIsLoadingTickets(true);
    setError(null);

    try {
      const response = await zendeskApi.getTickets(subdomain, email, apiToken, page);

      if (append) {
        setTickets(prev => [...prev, ...response.tickets]);
      } else {
        setTickets(response.tickets);
      }

      // Check if there are more tickets
      setHasMoreTickets(response.next_page !== null);
      setCurrentPage(page);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  /**
   * Handles search with filters
   *
   * @param {Object} filters - Search filters
   */
  const handleSearch = async (filters) => {
    const { subdomain, email, apiToken } = credentialsRef.current;
    setActiveFilters(filters);
    setIsLoadingTickets(true);
    setError(null);
    setSelectedTicketId(null);

    try {
      // Check if any filters are applied
      const hasFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.query.trim();

      if (hasFilters) {
        // Use search API
        const response = await zendeskApi.searchTickets(subdomain, email, apiToken, filters);
        setTickets(response.results || []);
        setHasMoreTickets(false); // Search doesn't support pagination in this simple implementation
      } else {
        // Load regular tickets
        await loadTickets(subdomain, email, apiToken, 1, false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  /**
   * Loads more tickets (pagination)
   */
  const handleLoadMore = async () => {
    const { subdomain, email, apiToken } = credentialsRef.current;
    const nextPage = currentPage + 1;
    await loadTickets(subdomain, email, apiToken, nextPage, true);
  };

  /**
   * Handles ticket selection and loads details
   *
   * @param {number} ticketId - Ticket ID
   */
  const handleTicketClick = async (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsLoadingDetails(true);

    try {
      const { subdomain, email, apiToken } = credentialsRef.current;
      const response = await zendeskApi.getTicketDetails(subdomain, email, apiToken, ticketId);

      setTicketDetails(response.ticket);
      setTicketComments(response.comments);
    } catch (error) {
      setError(`Failed to load ticket details: ${error.message}`);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  /**
   * Closes ticket details panel
   */
  const handleCloseDetails = () => {
    setSelectedTicketId(null);
    setTicketDetails(null);
    setTicketComments([]);
  };

  // Cleanup credentials when component unmounts
  useEffect(() => {
    return () => {
      credentialsRef.current = null;
    };
  }, []);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Main application interface
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Zendesk Tickets Explorer
              </h1>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{currentUser?.name || currentUser?.email}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {credentialsRef.current?.subdomain}.zendesk.com
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Filters */}
        <SearchFilters onSearch={handleSearch} isLoading={isLoadingTickets} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets List */}
          <div>
            <TicketList
              tickets={tickets}
              onTicketClick={handleTicketClick}
              selectedTicketId={selectedTicketId}
              isLoading={isLoadingTickets}
              hasMore={hasMoreTickets}
              onLoadMore={handleLoadMore}
            />
          </div>

          {/* Ticket Details */}
          <div className="lg:sticky lg:top-8 h-fit max-h-[calc(100vh-6rem)] overflow-hidden">
            <TicketDetails
              ticket={ticketDetails}
              comments={ticketComments}
              onClose={handleCloseDetails}
              isLoading={isLoadingDetails}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Security Notice:</strong> Your credentials are stored in memory only and will be cleared when you logout or close this page.
            </p>
            <p>
              Built with React • Powered by{' '}
              <a
                href="https://developer.zendesk.com/api-reference/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Zendesk API
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
