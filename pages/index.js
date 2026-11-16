import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hàm tìm kiếm bài hát
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setLyrics('');
    
    try {
      // Sử dụng API lyrics.ovh (miễn phí, không cần key)
      const parts = searchQuery.split('-');
      const artistName = parts[0]?.trim() || '';
      const songName = parts[1]?.trim() || searchQuery;
      
      const response = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(songName)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setLyrics(data.lyrics);
        setSongTitle(songName);
        setArtist(artistName);
      } else {
        setLyrics('❌ Không tìm thấy lời bài hát. Thử cú pháp: "Tên ca sĩ - Tên bài hát"');
      }
    } catch (error) {
      setLyrics('❌ Lỗi khi tìm kiếm. Vui lòng thử lại.');
    }
    
    setLoading(false);
  };

  // Hàm copy toàn bộ lyric
  const handleCopyAll = () => {
    navigator.clipboard.writeText(lyrics).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Hàm copy từng đoạn
  const handleCopyParagraph = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã copy đoạn này!');
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <h1 style={{
          textAlign: 'center',
          color: '#667eea',
          marginBottom: '10px',
          fontSize: '2.5rem'
        }}>
          🎵 Lyric Copy Tool
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px'
        }}>
          Tìm lời bài hát - Copy dễ dàng - Làm video nhanh chóng
        </p>

        {/* Thanh tìm kiếm */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ví dụ: Sơn Tùng M-TP - Chắc Ai Đó Sẽ Về"
            style={{
              flex: 1,
              padding: '15px',
              fontSize: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              background: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Đang tìm...' : 'Tìm'}
          </button>
        </div>

        {/* Kết quả */}
        {lyrics && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div>
                <h2 style={{ margin: 0, color: '#333' }}>{songTitle}</h2>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>{artist}</p>
              </div>
              <button
                onClick={handleCopyAll}
                style={{
                  padding: '10px 20px',
                  background: copied ? '#4CAF50' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {copied ? '✓ Đã copy!' : '📋 Copy tất cả'}
              </button>
            </div>

            {/* Hiển thị lời bài hát */}
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              maxHeight: '500px',
              overflowY: 'auto',
              lineHeight: '1.8',
              fontSize: '16px',
              whiteSpace: 'pre-wrap'
            }}>
              {lyrics.split('\n\n').map((paragraph, index) => (
                <div
                  key={index}
                  onClick={() => handleCopyParagraph(paragraph)}
                  style={{
                    marginBottom: '20px',
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#e9ecef'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  title="Click để copy đoạn này"
                >
                  {paragraph}
                </div>
              ))}
            </div>

            {/* Nút tạo LRC */}
            <button
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '15px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
              onClick={() => alert('Tính năng tạo LRC sẽ được thêm sau!')}
            >
              🎬 Tạo LRC từ bài này (Coming soon)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}