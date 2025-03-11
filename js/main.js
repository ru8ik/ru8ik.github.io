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
        <title>Rubik's Games Demo</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          :root {
            --primary-color: #3498db;
            --secondary-color: #2c3e50;
            --accent-color: #e74c3c;
            --light-bg: #f5f5f5;
            --dark-bg: #2c3e50;
            --text-color: #333;
            --light-text: #fff;
            --border-radius: 8px;
            --box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            --transition: all 0.3s ease;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--light-bg);
            color: var(--text-color);
            line-height: 1.6;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          
          header {
            background-color: var(--dark-bg);
            color: var(--light-text);
            padding: 30px 0;
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
          }
          
          header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(52, 152, 219, 0.2) 0%, rgba(52, 152, 219, 0) 50%);
            z-index: 1;
          }
          
          header .content {
            position: relative;
            z-index: 2;
          }
          
          h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
          }
          
          h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            color: var(--secondary-color);
            position: relative;
            padding-bottom: 10px;
          }
          
          h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background-color: var(--primary-color);
          }
          
          h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: var(--secondary-color);
          }
          
          .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 700px;
            margin: 0 auto;
          }
          
          .games-section {
            background-color: white;
            padding: 40px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            margin-bottom: 30px;
          }
          
          .game-description {
            margin-bottom: 30px;
            line-height: 1.8;
            color: #555;
            font-size: 1.1rem;
          }
          
          .tab-container {
            display: flex;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
          }
          
          .tab {
            padding: 12px 25px;
            background-color: transparent;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 500;
            transition: var(--transition);
            border-bottom: 3px solid transparent;
            margin-right: 10px;
            color: #777;
          }
          
          .tab.active {
            color: var(--primary-color);
            border-bottom: 3px solid var(--primary-color);
          }
          
          .tab:hover:not(.active) {
            color: var(--secondary-color);
            border-bottom: 3px solid #ddd;
          }
          
          .tab-content {
            display: none;
            animation: fadeIn 0.5s ease;
          }
          
          .tab-content.active {
            display: block;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .game-frame {
            width: 100%;
            height: 600px;
            border: none;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            background-color: white;
            margin-top: 15px;
          }
          
          .game-title {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: var(--secondary-color);
            display: flex;
            align-items: center;
          }
          
          .game-title i {
            margin-right: 10px;
            color: var(--primary-color);
          }
          
          .back-button {
            display: inline-flex;
            align-items: center;
            margin-top: 20px;
            padding: 12px 25px;
            background-color: var(--accent-color);
            color: white;
            text-decoration: none;
            border-radius: var(--border-radius);
            transition: var(--transition);
            font-weight: 500;
            box-shadow: 0 2px 5px rgba(231, 76, 60, 0.3);
          }
          
          .back-button i {
            margin-right: 8px;
          }
          
          .back-button:hover {
            background-color: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
          }
          
          .loading-indicator {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            color: var(--primary-color);
            font-size: 1.2rem;
          }
          
          .loading-indicator i {
            margin-right: 10px;
            animation: spin 1s infinite linear;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          footer {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 0.9rem;
            border-top: 1px solid #eee;
            margin-top: 20px;
          }
          
          .error-message {
            padding: 20px;
            background-color: #fdf2f2;
            border-left: 4px solid var(--accent-color);
            color: #721c24;
            margin-bottom: 20px;
            border-radius: 4px;
          }
          
          .error-message h3 {
            color: #721c24;
            margin-bottom: 10px;
          }
          
          .error-message a {
            color: var(--accent-color);
            text-decoration: none;
            font-weight: 500;
          }
          
          .error-message a:hover {
            text-decoration: underline;
          }
          
          @media (max-width: 768px) {
            .games-section {
              padding: 25px;
            }
            
            h1 {
              font-size: 2rem;
            }
            
            h2 {
              font-size: 1.7rem;
            }
            
            .tab {
              padding: 10px 15px;
              font-size: 1rem;
            }
            
            .game-frame {
              height: 450px;
            }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="content">
            <h1><i class="fas fa-gamepad"></i> Rubik's Games Demo</h1>
            <p class="subtitle">Experience interactive games from the repository</p>
          </div>
        </header>
        
        <div class="container">
          <div class="games-section">
            <h2>Available Games</h2>
            <p class="game-description">
              These games showcase different programming techniques and interactive elements.
              Select a game below to play directly in your browser.
            </p>
            
            <div class="tab-container">
              <button class="tab active" onclick="openTab(event, 'game1')">
                <i class="fas fa-dice"></i> Game 1
              </button>
              <button class="tab" onclick="openTab(event, 'game2')">
                <i class="fas fa-chess"></i> Game 2
              </button>
            </div>
            
            <div id="game1" class="tab-content active">
              <h3 class="game-title"><i class="fas fa-dice"></i> Game 1</h3>
              <div id="game1Loading" class="loading-indicator">
                <i class="fas fa-spinner"></i> Loading game...
              </div>
              <iframe id="game1Frame" class="game-frame" title="Game 1" style="display: none;"></iframe>
            </div>
            
            <div id="game2" class="tab-content">
              <h3 class="game-title"><i class="fas fa-chess"></i> Game 2</h3>
              <div id="game2Loading" class="loading-indicator">
                <i class="fas fa-spinner"></i> Loading game...
              </div>
              <iframe id="game2Frame" class="game-frame" title="Game 2" style="display: none;"></iframe>
            </div>
          </div>
          
          <a href="javascript:window.close()" class="back-button">
            <i class="fas fa-arrow-left"></i> Return to Portfolio
          </a>
        </div>
        
        <footer>
          &copy; <span id="year"></span> Rubik's Digital Workshop. All rights reserved.
        </footer>
        
        <script>
          // Set current year
          document.getElementById('year').textContent = new Date().getFullYear();
          
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
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.text();
              })
              .then(html => {
                document.getElementById('game1Loading').style.display = 'none';
                const game1Frame = document.getElementById('game1Frame');
                game1Frame.style.display = 'block';
                game1Frame.srcdoc = html;
              })
              .catch(error => {
                console.error("Error loading Game 1:", error);
                document.getElementById('game1Loading').style.display = 'none';
                document.getElementById('game1Frame').style.display = 'block';
                document.getElementById('game1Frame').srcdoc = \`
                  <div class="error-message" style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                    <h3><i class="fas fa-exclamation-triangle" style="color: #e74c3c; margin-right: 10px;"></i>Error Loading Game</h3>
                    <p>Could not load the game content. This might be due to cross-origin restrictions or the file may not be available.</p>
                    <p>Please visit the <a href="https://github.com/ru8ik/games/blob/master/game.html" target="_blank" style="color: #3498db; text-decoration: underline;">GitHub repository</a> to view the game code directly.</p>
                  </div>
                \`;
              });
            
            // Fetch and load Game 2
            fetch(game2Url)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.text();
              })
              .then(html => {
                document.getElementById('game2Loading').style.display = 'none';
                const game2Frame = document.getElementById('game2Frame');
                game2Frame.style.display = 'block';
                game2Frame.srcdoc = html;
              })
              .catch(error => {
                console.error("Error loading Game 2:", error);
                document.getElementById('game2Loading').style.display = 'none';
                document.getElementById('game2Frame').style.display = 'block';
                document.getElementById('game2Frame').srcdoc = \`
                  <div class="error-message" style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                    <h3><i class="fas fa-exclamation-triangle" style="color: #e74c3c; margin-right: 10px;"></i>Error Loading Game</h3>
                    <p>Could not load the game content. This might be due to cross-origin restrictions or the file may not be available.</p>
                    <p>Please visit the <a href="https://github.com/ru8ik/games/blob/master/game2.html" target="_blank" style="color: #3498db; text-decoration: underline;">GitHub repository</a> to view the game code directly.</p>
                  </div>
                \`;
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
