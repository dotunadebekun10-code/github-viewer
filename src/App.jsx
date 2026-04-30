import { useState } from 'react'
import './App.css'

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Shell: '#89e051',
  Vue: '#41b883',
  Dart: '#00B4AB',
};

function App() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchUser = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setUser(null);
    setRepos([]);

    try {
      const userRes = await fetch(`https://api.github.com/users/${trimmed}`)
      if (userRes.status === 404) {
        throw new Error("User not found");
      }
      const userData = await userRes.json();
      setUser(userData);

      //fetch repos
      const repoRes = await fetch(`https://api.github.com/users/${trimmed}/repos`);
      const repoData = await repoRes.json();
      setRepos(repoData);

      // sort by stars 
      const sortedRepos = repoData
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

      setRepos(sortedRepos);

    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }

  }

  const handleClear = () => {
    setUsername("");
    setUser(null);
    setRepos([]);
    setError("");
  };



  return (
    <>
      <div className='min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4'>

        <h1 className='text-3xl font-bold mb-6'>Github viewer</h1>

        <div className='flex gap-2'>
          <input type="text"
            placeholder='Enter Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUser()}
            className='px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-500'
          />
          <button onClick={fetchUser} className='px-4 py-2 bg-blue-600 font-semibold rounded-lg border-1 border-blue-300 hover:bg-blue-400 transition-colors duration-200 hover:border-blue-400'>
            {loading ? 'Loading...' : 'Search'}
          </button>
          {(username || user || error) && (
            <button onClick={handleClear} className='px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200'>
              Clear
            </button>
          )}
        </div>

        {error && (
          <p className='text-red-400 mt-4'>{error}</p>
        )}

        {user && (
          <div className='mt-8 bg-gray-800 p-6 rounded-lg shadow-md text-center w-80'>
            <img src={user.avatar_url}
              alt={user.name || user.login}
              className='w-24 h-24 rounded-full mx-auto mb-2 border-1 border-gray-400'
            />
            <h2 className='text-xl font-semibold'>
              {user.name || user.login}
            </h2>
            <a
              href={user.html_url}
              target='_blank'
              rel='noreferrer'
              className='text-blue-400 text-sm hover:underline'
            >
              @{user.login}
            </a>
            <p className='text-gray-400 text-sm mt-2'>{user.bio}</p>
            <div className='flex justify-between mt-4 text-sm'>
              <span>Followers: {user.followers}</span>
              <span>Following: {user.following}</span>
              <span>Public Repos: {user.public_repos}</span>
            </div>
          </div>
        )}

        {user && repos.length === 0 && !loading && (
          <p className='text-gray-500 text-sm mt-6'>No public repositories found.</p>
        )}

        {repos.length > 0 && (
          <div className='mt-6 w-full max-w-md'>
            {repos.map(repo => (
              <div key={repo.id} className='bg-gray-800 p-4 rounded-lg mb-3'>
                <a href={repo.html_url} target='_blank' rel='noreferrer'
                  className='text-blue-300 font-semibold hover:underline'>
                  {repo.name}
                </a>
                <p className='text-gray-400 text-sm mt-1'>{repo.description}</p>
                <div className='flex items-center gap-3 mt-2'>

                  {repo.language && (
                    <span className='flex items-center gap-1 text-sm text-gray-300'>
                      <span
                        style={{ backgroundColor: LANG_COLORS[repo.language] || '#8b949e' }}
                        className='w-3 h-3 rounded-full inline-block'
                      />
                      {repo.language}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}


      </div>




    </>
  )
}

export default App
