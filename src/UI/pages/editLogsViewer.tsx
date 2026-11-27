import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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

// Tracks whether the screen is phone-width, so the layout can switch
// between stacked rows (phones) and the full table (wider screens)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 599.95px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
};

const EditLogsViewer: React.FC = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
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

  // Parses the editor field, which may arrive as a JSON string
  const getEditor = (log: LogData) => {
    try {
      return typeof log.editor === 'string'
        ? JSON.parse(log.editor)
        : log.editor;
    } catch {
      return { name: 'Unknown', email: '' };
    }
  };

  const headers = ['Number', 'Editor', 'Reason', 'Timestamp', 'Action'];

  const viewButtonStyle: React.CSSProperties = {
    backgroundColor: 'green',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
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
          padding: isMobile ? '12px' : '40px',
          boxSizing: 'border-box',
        }}
      >
        {/* Single card: everything lives inside this one container */}
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            minWidth: 0,
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            padding: isMobile ? '16px' : '40px',
            overflow: 'hidden',
          }}
        >
          {/* Back to Edit Point Data */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => router.push('/editPointData')}
              style={{ ...viewButtonStyle, padding: '8px 16px' }}
            >
              BACK TO EDIT POINT DATA
            </button>
          </div>

          <h2
            style={{
              textAlign: 'center',
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: 700,
              marginBottom: '24px',
              color: '#1f2937',
            }}
          >
            Edit Logs
          </h2>

          {isMobile ? (
            // PHONE: each log is a stacked block with labelled fields
            <div>
              {logs.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280' }}>
                  No logs found.
                </p>
              ) : (
                logs.map((log, index) => {
                  const editor = getEditor(log);
                  return (
                    <div
                      key={log.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '14px',
                        marginBottom: '12px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>
                          #{index + 1}
                        </span>
                        <button
                          onClick={() => openModal(log)}
                          style={viewButtonStyle}
                        >
                          View
                        </button>
                      </div>

                      <p
                        style={{
                          fontWeight: 600,
                          color: '#1f2937',
                          margin: '0 0 2px',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {editor.name}
                      </p>
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          margin: '0 0 10px',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {editor.email}
                      </p>

                      <p
                        style={{
                          margin: '0 0 6px',
                          color: '#4b5563',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        <strong>Reason:</strong> {log.reasonForEdit || '—'}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#6b7280',
                        }}
                      >
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            // WIDER SCREENS: the original table
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
                    {headers.map((header) => (
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
                    ))}
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
                      const editor = getEditor(log);
                      return (
                        <tr
                          key={log.id}
                          style={{
                            borderBottom: '1px solid #e5e7eb',
                            transition: 'background-color 0.2s',
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
                            <p
                              style={{
                                fontWeight: 600,
                                color: '#1f2937',
                                margin: 0,
                              }}
                            >
                              {editor.name}
                            </p>
                            <p
                              style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                margin: 0,
                              }}
                            >
                              {editor.email}
                            </p>
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
                              style={viewButtonStyle}
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
          )}
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
              padding: '12px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '900px',
                boxSizing: 'border-box',
                padding: isMobile ? '18px' : '30px',
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
                // Scrolls sideways inside the modal instead of widening the screen
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                  <table
                    style={{
                      width: '100%',
                      minWidth: '420px',
                      borderCollapse: 'collapse',
                      fontSize: '14px',
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
                </div>
              )}

              <div style={{ textAlign: 'right' }}>
                <button onClick={closeModal} style={viewButtonStyle}>
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
