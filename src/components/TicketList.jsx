/**
 * TicketList Component
 *
 * Displays a list of tickets with pagination support.
 * Shows ticket ID, subject, status, priority, created date, and requester info.
 *
 * @param {Object} props
 * @param {Array} props.tickets - Array of ticket objects
 * @param {Function} props.onTicketClick - Callback when a ticket is clicked
 * @param {number} props.selectedTicketId - ID of currently selected ticket
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {boolean} props.hasMore - Whether more tickets are available
 * @param {Function} props.onLoadMore - Callback to load more tickets
 */
const TicketList = ({ tickets, onTicketClick, selectedTicketId, isLoading, hasMore, onLoadMore }) => {
  /**
   * Formats a date string to a readable format
   *
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Returns appropriate CSS classes for status badge
   *
   * @param {string} status - Ticket status
   * @returns {string} CSS class string
   */
  const getStatusBadgeClass = (status) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      open: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      hold: 'bg-orange-100 text-orange-800',
      solved: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return `${baseClasses} ${statusColors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  /**
   * Returns appropriate CSS classes for priority badge
   *
   * @param {string} priority - Ticket priority
   * @returns {string} CSS class string
   */
  const getPriorityBadgeClass = (priority) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    const priorityColors = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    };
    return `${baseClasses} ${priorityColors[priority] || 'bg-gray-100 text-gray-600'}`;
  };

  if (isLoading && tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="mt-4 text-gray-600">Loading tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No tickets found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Tickets ({tickets.length})
        </h2>
      </div>

      {/* Ticket List */}
      <div className="divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onTicketClick(ticket.id)}
            className={`p-6 cursor-pointer transition duration-150 hover:bg-gray-50 ${
              selectedTicketId === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            {/* Ticket Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono text-gray-500">#{ticket.id}</span>
                <div className="flex space-x-2">
                  <span className={getStatusBadgeClass(ticket.status)}>
                    {ticket.status}
                  </span>
                  {ticket.priority && (
                    <span className={getPriorityBadgeClass(ticket.priority)}>
                      {ticket.priority}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(ticket.created_at)}
              </span>
            </div>

            {/* Ticket Subject */}
            <h3 className="text-base font-medium text-gray-900 mb-2">
              {ticket.subject || 'No subject'}
            </h3>

            {/* Ticket Description Preview */}
            {ticket.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {ticket.description}
              </p>
            )}

            {/* Requester Info */}
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Requester ID: {ticket.requester_id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Tickets'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketList;
