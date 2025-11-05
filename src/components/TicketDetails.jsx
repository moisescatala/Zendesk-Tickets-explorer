/**
 * TicketDetails Component
 *
 * Displays detailed information about a selected ticket including
 * full ticket history, comments, and custom fields.
 *
 * @param {Object} props
 * @param {Object} props.ticket - Ticket object with details
 * @param {Array} props.comments - Array of comment objects
 * @param {Function} props.onClose - Callback to close the details panel
 * @param {boolean} props.isLoading - Loading state indicator
 */
const TicketDetails = ({ ticket, comments, onClose, isLoading }) => {
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
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
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
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    const priorityColors = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    };
    return `${baseClasses} ${priorityColors[priority] || 'bg-gray-100 text-gray-600'}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 h-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">Loading ticket details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 h-full">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Ticket Selected</h3>
          <p className="text-sm text-gray-500">
            Select a ticket from the list to view its details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Ticket Details
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition duration-150"
          aria-label="Close details"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Ticket Info */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-mono text-gray-500">#{ticket.id}</span>
            <span className={getStatusBadgeClass(ticket.status)}>{ticket.status}</span>
            {ticket.priority && (
              <span className={getPriorityBadgeClass(ticket.priority)}>{ticket.priority}</span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {ticket.subject || 'No subject'}
          </h3>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Created</p>
            <p className="text-sm text-gray-900">{formatDate(ticket.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Updated</p>
            <p className="text-sm text-gray-900">{formatDate(ticket.updated_at)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Requester ID</p>
            <p className="text-sm text-gray-900">{ticket.requester_id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Assignee ID</p>
            <p className="text-sm text-gray-900">{ticket.assignee_id || 'Unassigned'}</p>
          </div>
          {ticket.type && (
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Type</p>
              <p className="text-sm text-gray-900 capitalize">{ticket.type}</p>
            </div>
          )}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Description</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {ticket.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Custom Fields */}
        {ticket.custom_fields && ticket.custom_fields.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Custom Fields</h4>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              {ticket.custom_fields.map((field) => (
                <div key={field.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">Field {field.id}:</span>
                  <span className="text-gray-900 font-medium">
                    {field.value !== null ? String(field.value) : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments/History */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase mb-3">
            Comments & History ({comments?.length || 0})
          </h4>
          {comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">
                        {comment.author_id === ticket.requester_id ? 'Requester' : `User ${comment.author_id}`}
                      </span>
                      {comment.public === false && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                          Private
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.body}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No comments available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
