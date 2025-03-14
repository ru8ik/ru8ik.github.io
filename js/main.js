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
  
  // Articles pagination functionality
  const articlesPages = document.querySelectorAll('.articles-page');
  if (articlesPages.length > 0) {
    const pageIndicators = document.querySelectorAll('.page-indicator');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    let currentPage = 1;
    
    // Show the first page by default
    articlesPages[0].style.display = 'grid';
    
    // Function to show a specific page
    function showPage(pageNum) {
      // Hide all pages
      articlesPages.forEach(page => {
        page.style.display = 'none';
      });
      
      // Show the selected page
      articlesPages[pageNum - 1].style.display = 'grid';
      
      // Update active indicator
      pageIndicators.forEach(indicator => {
        indicator.classList.remove('active');
      });
      pageIndicators[pageNum - 1].classList.add('active');
      
      // Update button states
      prevButton.disabled = (pageNum === 1);
      nextButton.disabled = (pageNum === articlesPages.length);
      
      // Update current page
      currentPage = pageNum;
    }
    
    // Add click event to page indicators
    pageIndicators.forEach(indicator => {
      indicator.addEventListener('click', function() {
        const pageNum = parseInt(this.getAttribute('data-page'));
        showPage(pageNum);
      });
    });
    
    // Add click events to prev/next buttons
    if (prevButton && nextButton) {
      prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
          showPage(currentPage - 1);
        }
      });
      
      nextButton.addEventListener('click', function() {
        if (currentPage < articlesPages.length) {
          showPage(currentPage + 1);
        }
      });
    }
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
      // Hide loading indicator
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }

      // Filter repos to only include selected ones
      const filteredRepos = repos.filter(repo => selectedRepos.includes(repo.name));

      if (filteredRepos.length === 0) {
        projectsList.innerHTML = '<div class="no-projects"><i class="fas fa-exclamation-circle"></i> No projects found.</div>';
        return;
      }

      // Sort repos by last updated date (newest first)
      filteredRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      // Create HTML for each project
      filteredRepos.forEach((repo, index) => {
        // Create project element
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        
        // Format date
        const updatedDate = new Date(repo.updated_at);
        const formattedDate = updatedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Add demo URL for ant-table-app if it doesn't have one
        let demoUrl = repo.homepage;
        if (repo.name === 'ant-table-app' && !demoUrl) {
          demoUrl = 'https://ru8ik.github.io/ant-table-app/';
        }

        // Set project HTML content
        projectElement.innerHTML = `
          <h3>${repo.name}</h3>
          <div class="project-meta">
            <span><i class="fas fa-calendar-alt"></i> Last updated: ${formattedDate}</span>
            <span><i class="fas fa-code-branch"></i> ${repo.forks_count} Forks</span>
          </div>
          <p>${repo.description || 'No description available.'}</p>
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" class="repo-link">
              <i class="fab fa-github"></i> View Repository
            </a>
            ${repo.name === 'games' ? 
              `<a href="javascript:void(0)" onclick="openGamesDemo()" class="demo-link">
                <i class="fas fa-play"></i> Demo
              </a>` : 
              (demoUrl ? 
                `<a href="${demoUrl}" target="_blank" class="demo-link">
                  <i class="fas fa-play"></i> Demo
                </a>` : 
                ''
              )
            }
          </div>
        `;

        // Add project to the list with a delay for animation
        setTimeout(() => {
          projectsList.appendChild(projectElement);
          setTimeout(() => {
            projectElement.classList.add('visible');
          }, 100);
        }, index * 200);
      });
    })
    .catch(error => {
      console.error('Error fetching projects:', error);
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

function openGamesDemo() {
  // Redirect to the games directory
  window.location.href = 'games/index.html';
}
