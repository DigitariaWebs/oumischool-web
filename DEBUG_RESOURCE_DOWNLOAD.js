// Debug script for resource download testing
// Run this in browser console on /student/resources page

async function testResourceDownload(resourceId) {
  console.log('🧪 Starting resource download test...');
  
  // Step 1: Check token
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.error('❌ No auth token found in localStorage');
    return;
  }
  console.log('✅ Token found:', token.substring(0, 30) + '...');
  
  // Step 2: Test API endpoint
  const url = `/api/resources/${resourceId}/download?token=${encodeURIComponent(token)}`;
  console.log('📡 Testing endpoint:', url);
  
  try {
    const response = await fetch(url);
    console.log('📊 Response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('❌ API Error:', text);
      return;
    }
    
    // Step 3: Check file size
    const blob = await response.blob();
    console.log('✅ File downloaded successfully!');
    console.log('📦 File info:', {
      size: blob.size,
      type: blob.type,
      sizeKB: (blob.size / 1024).toFixed(2) + ' KB',
    });
    
    // Step 4: Offer download
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `resource-${resourceId}.bin`;
    
    console.log('💾 Download link created. Click link to download:');
    console.log(link);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Usage: testResourceDownload('RESOURCE_ID_HERE')
// Example: testResourceDownload('ee62d0b5-bd04-44ad-9e16-9a1b418148e8')

console.log('🚀 Resource Debug Utilities Loaded!');
console.log('Available functions:');
console.log('  testResourceDownload(resourceId) - Test download endpoint');
