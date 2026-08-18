export default function Icon({ name, emoji, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80px',
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{
        fontSize: '40px',
        marginBottom: '4px',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      }}>
        {emoji}
      </div>
      <span style={{
        color: 'white',
        fontSize: '12px',
        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        textAlign: 'center',
        fontWeight: '500',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: '2px 6px',
        borderRadius: '10px'
      }}>
        {name}
      </span>
    </div>
  );
}
