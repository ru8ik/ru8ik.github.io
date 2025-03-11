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
        <title>Games Demo</title>
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
          }
          .games-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .game-frame {
            width: 100%;
            height: 600px;
            border: none;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            background-color: white;
          }
          .game-title {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #2c3e50;
          }
          .back-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
          }
          .back-button:hover {
            background-color: #c0392b;
          }
          .game-description {
            margin-bottom: 20px;
            line-height: 1.6;
          }
          .games-section {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }
          .tab-container {
            display: flex;
            margin-bottom: 20px;
          }
          .tab {
            padding: 10px 20px;
            background-color: #ecf0f1;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s;
            border-radius: 4px 4px 0 0;
            margin-right: 5px;
          }
          .tab.active {
            background-color: #3498db;
            color: white;
          }
          .tab:hover:not(.active) {
            background-color: #d5dbdb;
          }
          .tab-content {
            display: none;
          }
          .tab-content.active {
            display: block;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>Games Demo</h1>
          <p>Experience the games from the repository</p>
        </header>
        <div class="container">
          <div class="games-section">
            <h2>Available Games</h2>
            <p class="game-description">
              These games are part of the GitHub repository. Select a game below to play.
            </p>
            
            <div class="tab-container">
              <button class="tab active" onclick="openTab(event, 'game1')">Game 1</button>
              <button class="tab" onclick="openTab(event, 'game2')">Game 2</button>
            </div>
            
            <div id="game1" class="tab-content active">
              <h3 class="game-title">Game 1</h3>
              <iframe id="game1Frame" class="game-frame" title="Game 1"></iframe>
            </div>
            
            <div id="game2" class="tab-content">
              <h3 class="game-title">Game 2</h3>
              <iframe id="game2Frame" class="game-frame" title="Game 2"></iframe>
            </div>
          </div>
          
          <a href="javascript:window.close()" class="back-button">Close Demo</a>
        </div>
        
        <script>
          // Function to switch between tabs
          function openTab(evt, tabName) {
            const tabContents = document.getElementsByClassName("tab-content");
            for (let i = 0; i < tabContents.length; i++) {
              tabContents[i].classList.remove("active");
            }
            
            const tabs = document.getElementsByClassName("tab");
            for (let i = 0; i < tabs.length; i++) {
              tabs[i].classList.remove("active");
            }
            
            document.getElementById(tabName).classList.add("active");
            evt.currentTarget.classList.add("active");
          }
          
          // Function to load game content
          function loadGameContent() {
            // URLs for the raw game HTML files
            const game1Url = "https://raw.githubusercontent.com/ru8ik/games/master/game.html";
            const game2Url = "https://raw.githubusercontent.com/ru8ik/games/master/game2.html";
            
            // Fetch and load Game 1
            fetch(game1Url)
              .then(response => response.text())
              .then(html => {
                const game1Frame = document.getElementById('game1Frame');
                game1Frame.srcdoc = html;
              })
              .catch(error => {
                console.error("Error loading Game 1:", error);
                document.getElementById('game1Frame').srcdoc = '<div style="padding: 20px; text-align: center;"><h3>Error Loading Game</h3><p>Could not load the game content. Please try again later or visit the <a href="https://github.com/ru8ik/games/blob/master/game.html" target="_blank">GitHub repository</a>.</p></div>';
              });
            
            // Fetch and load Game 2
            fetch(game2Url)
              .then(response => response.text())
              .then(html => {
                const game2Frame = document.getElementById('game2Frame');
                game2Frame.srcdoc = html;
              })
              .catch(error => {
                console.error("Error loading Game 2:", error);
                document.getElementById('game2Frame').srcdoc = '<div style="padding: 20px; text-align: center;"><h3>Error Loading Game</h3><p>Could not load the game content. Please try again later or visit the <a href="https://github.com/ru8ik/games/blob/master/game2.html" target="_blank">GitHub repository</a>.</p></div>';
              });
          }
          
          // Load game content when the page loads
          window.onload = loadGameContent;
        </script>
      </body>
      </html>
    `);
    gamesWindow.document.close();
  } else {
    alert('Please allow pop-ups to view the games demo.');
  }
}
