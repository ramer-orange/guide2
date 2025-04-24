// src/components/TestApi.jsx
import { useState } from 'react';
import api from '../api/api';

function TestApi() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testConnection = async () => {
    setLoading(true);
    try {
      const testData = { 
        message: 'Hello from React', 
        timestamp: new Date().toISOString() 
      };
      
      const result = await api.post('/echo', testData);
      setResponse(result.data);
    } catch (error) {
      console.error('API接続エラー:', error);
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>API接続テスト</h2>
      <button onClick={testConnection} disabled={loading}>
        {loading ? '接続中...' : 'APIをテスト'}
      </button>
      
      {response && (
        <div>
          <h3>レスポンス:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default TestApi;