document.addEventListener('DOMContentLoaded', () => {
  // Set current year in copyright
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Projects page functionality
  const projectsList = document.getElementById('projects-list');
  if (projectsList) {
    loadProjects(projectsList);
  }

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add hover effects to tech categories
  const techCategories = document.querySelectorAll('.tech-category');
  if (techCategories.length > 0) {
    techCategories.forEach(category => {
      category.addEventListener('mouseenter', () => {
        category.style.transform = 'translateY(-5px)';
      });
      category.addEventListener('mouseleave', () => {
        category.style.transform = 'translateY(0)';
      });
    });
  }
});

// Function to load projects from GitHub API
function loadProjects(projectsList) {
  // Array of repository names to display
  const selectedRepos = ["ant-table-app", "api-PyArrow-case-study-sec-gov", "TodoApp", "CS-UI-API-Automation", "games"];
  const loadingIndicator = document.querySelector('.loading-indicator');

  fetch('https://api.github.com/users/ru8ik/repos')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(repos => {
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }

      // Filter and sort repositories
      const filteredRepos = repos.filter(repo => selectedRepos.includes(repo.name))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      if (filteredRepos.length === 0) {
        projectsList.innerHTML = '<div class="no-projects">No projects available at the moment. Check back soon!</div>';
        return;
      }

      // Display each repository
      filteredRepos.forEach((repo, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';
        projectDiv.style.animationDelay = `${index * 0.2}s`;
        
        // Create project content
        let projectContent = `
          <h3><i class="fas fa-folder-open"></i> ${repo.name}</h3>
          <p>${repo.description ? repo.description : 'No description available.'}</p>
          <div class="project-meta">
            <span><i class="fas fa-code-branch"></i> ${repo.forks_count} Forks</span>
            <span><i class="fas fa-star"></i> ${repo.stargazers_count} Stars</span>
            <span><i class="fas fa-eye"></i> ${repo.watchers_count} Watchers</span>
          </div>
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" class="repo-link">
              <i class="fab fa-github"></i> View Repository
            </a>
        `;
        
        // Add live demo link for specific projects
        if (repo.name === 'ant-table-app') {
          projectContent += `
            <a href="https://ru8ik.github.io/ant-table-app" target="_blank" class="demo-link">
              <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
          `;
        } else if (repo.name === 'games') {
          projectContent += `
            <a href="javascript:void(0)" class="demo-link" onclick="openGamesDemo()">
              <i class="fas fa-gamepad"></i> Live Demo
            </a>
          `;
        }
        
        projectContent += `</div>`;
        projectDiv.innerHTML = projectContent;
        projectsList.appendChild(projectDiv);
        
        // Add fade-in animation
        setTimeout(() => {
          projectDiv.classList.add('visible');
        }, 100 + (index * 200));
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
      projectsList.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Sorry, there was an error loading the projects. Please try again later.</p>
        </div>
      `;
    });
}

// Function to open games demo in a new window
function openGamesDemo() {
  const gamesWindow = window.open('', '_blank');
  
  if (gamesWindow) {
    gamesWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Games Repository</title>
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
            border-radius: 8px;
          }
          .content-box {
            background-color: white;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 10px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            transition: all 0.3s ease;
            text-align: center;
          }
          .primary-button {
            background-color: #3498db;
            color: white;
          }
          .primary-button:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
          }
          .secondary-button {
            background-color: #2ecc71;
            color: white;
          }
          .secondary-button:hover {
            background-color: #27ae60;
            transform: translateY(-2px);
          }
          .close-button {
            background-color: #e74c3c;
            color: white;
          }
          .close-button:hover {
            background-color: #c0392b;
            transform: translateY(-2px);
          }
          h2 {
            color: #2c3e50;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 10px;
            margin-top: 0;
          }
          .icon {
            margin-right: 8px;
          }
          .steps {
            margin-left: 20px;
            line-height: 1.6;
          }
          .steps li {
            margin-bottom: 10px;
          }
          .note {
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
          }
        </style>
      </head>
      <body>
        <header>
          <h1><i class="fas fa-gamepad"></i> Games Repository</h1>
          <p>Access and play the games from the GitHub repository</p>
        </header>
        
        <div class="container">
          <div class="content-box">
            <h2>How to Access the Games</h2>
            <p>The games are hosted on GitHub. Follow these steps to access and play them:</p>
            
            <ol class="steps">
              <li>Visit the GitHub repository by clicking the button below</li>
              <li>Navigate to the game files (game.html and game2.html)</li>
              <li>Download the files to your computer</li>
              <li>Open the HTML files in your browser to play the games</li>
            </ol>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://github.com/ru8ik/games" target="_blank" class="button primary-button">
                <i class="fab fa-github icon"></i>View GitHub Repository
              </a>
            </div>
            
            <div class="note">
              <strong>Note:</strong> The games are not directly playable online through GitHub Pages at this time. 
              You'll need to download the files to play them locally.
            </div>
          </div>
          
          <div class="content-box">
            <h2>Direct Links to Game Files</h2>
            <p>You can view the game files directly on GitHub:</p>
            
            <div style="text-align: center;">
              <a href="https://github.com/ru8ik/games/blob/master/game.html" target="_blank" class="button secondary-button">
                <i class="fas fa-file-code icon"></i>View Game 1
              </a>
              <a href="https://github.com/ru8ik/games/blob/master/game2.html" target="_blank" class="button secondary-button">
                <i class="fas fa-file-code icon"></i>View Game 2
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="javascript:window.close()" class="button close-button">
              <i class="fas fa-times icon"></i>Close Window
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
    gamesWindow.document.close();
  } else {
    alert('Please allow pop-ups to view the games repository information.');
  }
}
