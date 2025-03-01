document.addEventListener('DOMContentLoaded', () => {
  // Array of repository names to display
  const selectedRepos = ["ant-table-app", "api-PyArrow-case-study-sec-gov", "TodoApp", "CS-UI-API-Automation"];

  fetch('https://api.github.com/users/ru8ik/repos')
    .then(response => response.json())
    .then(repos => {
      const projectsList = document.getElementById('projects-list');
      if (!projectsList) {
        console.error('Element with id "projects-list" not found.');
        return;
      }
      repos.forEach(repo => {
        // Display the repository if its name is in the selectedRepos array
        if (!selectedRepos.includes(repo.name)) return;
        
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';
        
        // If the repository is "ant-table-app", add an extra button
        if (repo.name === 'ant-table-app') {
          projectDiv.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description ? repo.description : 'No description available.'}</p>
            <a href="${repo.html_url}" target="_blank">View Repository</a>
            <br>
            <a href="https://ru8ik.github.io/ant-table-app" target="_blank" class="btn">Open Live App</a>
          `;
        } else {
          projectDiv.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description ? repo.description : 'No description available.'}</p>
            <a href="${repo.html_url}" target="_blank">View Repository</a>
          `;
        }
        projectsList.appendChild(projectDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
    });
});
