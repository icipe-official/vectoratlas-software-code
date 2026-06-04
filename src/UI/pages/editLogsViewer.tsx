import { useEffect, useState } from 'react';
import { getAllEditLogs } from '../api/api';
import { GetServerSidePropsContext } from 'next';
import { getMessages } from '../utils/localization';

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
  const [selectedLog, setSelectedLog] = useState<LogData | null>(null);
  const [diffData, setDiffData] = useState<Record<
    string,
    { old: any; new: any }
  > | null>(null);

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

  const getDifferences = (
    initial: Record<string, any>,
    modified: Record<string, any>
  ) => {
    const diff: Record<string, { old: any; new: any }> = {};
    const allKeys = new Set([
      ...Object.keys(initial),
      ...Object.keys(modified),
    ]);
    allKeys.forEach((key) => {
      if (JSON.stringify(initial[key]) !== JSON.stringify(modified[key])) {
        diff[key] = { old: initial[key], new: modified[key] };
      }
    });
    return diff;
  };

  const openModal = (log: LogData) => {
    const differences = getDifferences(log.initialData, log.modifiedData);
    setSelectedLog(log);
    setDiffData(differences);
  };

  const closeModal = () => {
    setSelectedLog(null);
    setDiffData(null);
  };

  return (
    <main>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#f3f4f6',
          padding: '40px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            padding: '40px',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '30px',
              color: '#1f2937',
            }}
          >
            Edit Logs
          </h2>

          <div style={{ overflowX: 'auto', borderRadius: '8px' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'center',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {['Number', 'Editor', 'Reason', 'Timestamp', 'Action'].map(
                    (header) => (
                      <th
                        key={header}
                        style={{
                          border: '1px solid #e5e7eb',
                          padding: '14px 18px',
                          fontSize: '14px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: '#374151',
                          verticalAlign: 'top',
                        }}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: '30px',
                        color: '#6b7280',
                        fontSize: '16px',
                      }}
                    >
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => {
                    let editor: any = {};
                    try {
                      editor =
                        typeof log.editor === 'string'
                          ? JSON.parse(log.editor)
                          : log.editor;
                    } catch {
                      editor = { name: 'Unknown', email: '' };
                    }

                    return (
                      <tr
                        key={log.id}
                        style={{
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background-color 0.2s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = '#f3f4f6')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            'transparent')
                        }
                      >
                        <td
                          style={{
                            padding: '12px 18px',
                            color: '#374151',
                            verticalAlign: 'top',
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: '12px 18px',
                            verticalAlign: 'top',
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontWeight: 600,
                                color: '#1f2937',
                              }}
                            >
                              {editor.name}
                            </p>
                            <p
                              style={{
                                fontSize: '13px',
                                color: '#6b7280',
                              }}
                            >
                              {editor.email}
                            </p>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '12px 18px',
                            color: '#4b5563',
                            verticalAlign: 'top',
                          }}
                        >
                          {log.reasonForEdit || '—'}
                        </td>
                        <td
                          style={{
                            padding: '12px 18px',
                            color: '#6b7280',
                            verticalAlign: 'top',
                          }}
                        >
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: '12px 18px',
                            verticalAlign: 'top',
                          }}
                        >
                          <button
                            onClick={() => openModal(log)}
                            style={{
                              backgroundColor: 'green',
                              color: '#fff',
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}
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
        {selectedLog && diffData && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '900px',
                padding: '30px',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  color: '#1f2937',
                }}
              >
                Data Differences
              </h3>

              {Object.keys(diffData).length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280' }}>
                  No differences found.
                </p>
              ) : (
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                    marginBottom: '20px',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th
                        style={{
                          border: '1px solid #e5e7eb',
                          padding: '10px',
                          textAlign: 'left',
                          fontWeight: 600,
                          verticalAlign: 'top',
                        }}
                      >
                        Field
                      </th>
                      <th
                        style={{
                          border: '1px solid #e5e7eb',
                          padding: '10px',
                          textAlign: 'left',
                          color: '#dc2626',
                          verticalAlign: 'top',
                        }}
                      >
                        Old Value
                      </th>
                      <th
                        style={{
                          border: '1px solid #e5e7eb',
                          padding: '10px',
                          textAlign: 'left',
                          color: '#16a34a',
                          verticalAlign: 'top',
                        }}
                      >
                        New Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(diffData).map(([key, val]) => (
                      <tr key={key}>
                        <td
                          style={{
                            border: '1px solid #e5e7eb',
                            padding: '10px',
                            fontWeight: 500,
                            color: '#374151',
                            verticalAlign: 'top',
                          }}
                        >
                          {key}
                        </td>
                        <td
                          style={{
                            border: '1px solid #e5e7eb',
                            padding: '10px',
                            color: '#dc2626',
                            wordBreak: 'break-word',
                            verticalAlign: 'top',
                          }}
                        >
                          {JSON.stringify(val.old, null, 2)}
                        </td>
                        <td
                          style={{
                            border: '1px solid #e5e7eb',
                            padding: '10px',
                            color: '#16a34a',
                            wordBreak: 'break-word',
                            verticalAlign: 'top',
                          }}
                        >
                          {JSON.stringify(val.new, null, 2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={closeModal}
                  style={{
                    backgroundColor: 'green',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'green')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'green')
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default EditLogsViewer;
