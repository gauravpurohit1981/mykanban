import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="hidden md:block bg-white w-64 border-r border-gray-200 p-4">
      <nav className="space-y-1">
        <Link href="/">
          <a className={`block py-2.5 px-4 rounded-lg ${
            location === '/' 
              ? 'bg-blue-50 text-primary' 
              : 'text-gray-600 hover:bg-gray-50'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
        </Link>
        
        <Link href="/calendar">
          <a className={`block py-2.5 px-4 rounded-lg ${
            location === '/calendar' 
              ? 'bg-blue-50 text-primary' 
              : 'text-gray-600 hover:bg-gray-50'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendar
          </a>
        </Link>
        
        <div className="pt-4 pb-2">
          <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Categories
          </div>
        </div>
        
        <Link href="/?category=personal">
          <a className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center">
            <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
            Personal Tasks
          </a>
        </Link>
        
        <Link href="/?category=college">
          <a className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center">
            <div className="w-2 h-2 rounded-full bg-secondary mr-3"></div>
            College Tasks
          </a>
        </Link>
        
        <div className="pt-4 pb-2">
          <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Filters
          </div>
        </div>
        
        <Link href="/?tab=today">
          <a className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Due Today
          </a>
        </Link>
        
        <Link href="/?priority=high">
          <a className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            High Priority
          </a>
        </Link>
        
        <Link href="/?status=completed">
          <a className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed
          </a>
        </Link>
      </nav>
    </aside>
  );
}
