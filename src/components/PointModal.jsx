/* eslint-disable react/prop-types */
function PointModal({
  selectedPoint,
  handleModalClose,
  handleCommentChange,
  handleStatusChange,
  handleUpdatePoint,
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Point</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            value={selectedPoint.details}
            onChange={handleCommentChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <button
            onClick={handleStatusChange}
            className={`px-4 py-2 rounded-md ${
              selectedPoint.status ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {selectedPoint.status ? "true" : "false"}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleModalClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdatePoint}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default PointModal;
