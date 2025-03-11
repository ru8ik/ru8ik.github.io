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
  const selectedRepos = ["ant-table-app", "api-PyArrow-case-study-sec-gov", "TodoApp", "CS-UI-API-Automation"];
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
