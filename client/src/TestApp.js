import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🎉 Shopify Free Gift App - Test Page</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Next Steps:</h3>
        <ul>
          <li>✅ React is loading</li>
          <li>✅ JavaScript is working</li>
          <li>🔄 Now we can load the full Polaris UI</li>
        </ul>
      </div>
    </div>
  );
}

export default TestApp;