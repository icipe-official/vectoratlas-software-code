import { useEffect, useState } from "react";
import { getAllEditLogs } from "../api/api";
import { GetServerSidePropsContext } from "next";
import { getMessages } from "../utils/localization";

interface LogData {
  id: number;
  occurrenceId: string;
  editor: string | { name: string; email: string };
  reasonForEdit?: string;
  timestamp: string;
  initialData: Record<string, any>;
  modifiedData: Record<string, any>;
}

const EditLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogData | null>(null); // For modal
  const [modalType, setModalType] = useState<"initial" | "modified" | null>(
    null
  );

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAllEditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  const openModal = (log: LogData, type: "initial" | "modified") => {
    setSelectedLog(log);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedLog(null);
    setModalType(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Edit Logs
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Occurrence ID</th>
                <th className="px-4 py-2 border">Editor</th>
                <th className="px-4 py-2 border">Reason</th>
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">Initial Data</th>
                <th className="px-4 py-2 border">Modified Data</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => {
                  let editor = {};
                  try {
                    editor =
                      typeof log.editor === "string"
                        ? JSON.parse(log.editor)
                        : log.editor;
                  } catch {
                    editor = { name: "Unknown", email: "" };
                  }

                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {log.occurrenceId}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        <strong>{(editor as any).name}</strong>
                        <br />
                        <span className="text-gray-500 text-xs">
                          {(editor as any).email}
                        </span>
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {log.reasonForEdit || "—"}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border text-xs text-center">
                        <button
                          onClick={() => openModal(log, "initial")}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View
                        </button>
                      </td>
                      <td className="px-4 py-2 border text-xs text-center">
                        <button
                          onClick={() => openModal(log, "modified")}
                          className="text-green-600 underline hover:text-green-800"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedLog && modalType && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg overflow-auto max-h-[80vh]">
            <h3 className="text-xl font-semibold mb-4">
              {modalType === "initial" ? "Initial Data" : "Modified Data"}
            </h3>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm text-gray-700">
              {JSON.stringify(
                modalType === "initial"
                  ? selectedLog.initialData
                  : selectedLog.modifiedData,
                null,
                2
              )}
            </pre>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default EditLogsViewer;
