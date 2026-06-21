const GITHUB_CONFIG = {
  owner: '2madrugadas',
  repo: 'web',
  filePath: 'data/publications.json',
  apiUrl: 'https://api.github.com'
};

export function getGitHubToken() {
  return localStorage.getItem('githubToken');
}

export function setGitHubToken(token) {
  localStorage.setItem('githubToken', token);
}

async function getGitHubHeaders() {
  const token = getGitHubToken();
  return {
    'Authorization': `token ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  };
}

export async function getPublications() {
  try {
    const url = `${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return { photos: [], videos: [], essays: [] };
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = atob(data.content);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return { photos: [], videos: [], essays: [] };
  }
}

export async function savePublications(publications) {
  try {
    const token = getGitHubToken();
    if (!token) {
      throw new Error('No GitHub token configured');
    }
    
    const url = `${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`;
    
    const content = btoa(JSON.stringify(publications, null, 2));
    
    const existingData = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    let body = {
      message: 'Update publications',
      content: content
    };
    
    if (existingData.ok) {
      const data = await existingData.json();
      body.sha = data.sha;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving publications:', error);
    throw error;
  }
}

export async function testGitHubToken(token) {
  try {
    const response = await fetch(`${GITHUB_CONFIG.apiUrl}/user`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}
