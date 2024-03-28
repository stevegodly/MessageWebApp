export default function Logo() {
    return (
      <div className="text-blue-600 font-bold flex gap-2 p-4">
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 10h50a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H45l-10 10V50L25 40z" fill="#4CAF50"/>
          <ellipse cx="20" cy="40" rx="5" ry="10" fill="#4CAF50"/>
        </svg>
        ChatApp
      </div>
    );
  }