// 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
// List to do
// A list of all repos that are forked ones from Technigo
// Your username and profile picture - DONE
// Most recent update (push) for each repo 
// Name of your default branch for each repo - DONE
// URL to the actual GitHub repo - DONE
// Number of commit messages for each repo
// All pull requests
// A chart of how many projects you've done so far, compared to how many you will do using Chart.js. Here's documentation on how to get started, 
// and in the left menu you can also find example usage.


const user = document.querySelector(".user-info");
const projects = document.querySelector("#projects");




const username = "sukiphan97";
const API_URL = `https://api.github.com/users/${username}/repos`

let reponame;

const options = {
    method: "GET",
    headers: {
        Authorization: "token"
    }
}

fetch (API_URL, options)
    .then(res => res.json())
    .then(data => {
     console.log(data)
      userInfo(data[0]);

        data.forEach(project => {

          technigoRepo(project);
          gitDashBoard(project);
          
        })
        
      })
      
      
      // Your username and profile picture
      const userInfo = (data) => {

        const userPicture = data.owner.avatar_url;
        
        user.innerHTML += `
        
        <div class="container">
        <img src=${userPicture}/>
        <h1> Suki (Nhung) Phan </h1> 
        <span class="user-name"> ${username} </span>
        <p> Front End Development Student </p>
        <a href="https://github.com/sukiphan97" class="follow-btn" target="_blank"> Follow </a>
        </div>
        
        <img class="organization-img hidden" src="https://avatars.githubusercontent.com/u/30344334?v=4" alt="technigo"/>
        
        `
      }
      
      
      
      // All pull request
      const technigoRepo = (project) => {
        
        reponame = project.name;

        fetch(`https://api.github.com/repos/Technigo/${reponame}/pulls?per_page=100`)
        .then(res => res.json())
        .then(data => {

          
          reponame = data.map(item => item.base.repo.name);
          
                const first = data.filter(item =>  item.user.login === username);
                
                const second = data.filter(item => item.base.repo.name === "project-weather-app" && item.user.login === "emmahogberg88");

                //Combine all pull request links
                const allPR = first.concat(second);
                
                //Get the commits
                const commits_URL = allPR.map(item => item.commits_url);

                //Get the comments
                const comments_URL = allPR.map(item => item.review_comments_url);

                // Display commits;
                if(commits_URL.length === 0) {
                  document.getElementById(reponame[0]).innerHTML += `<span>No commit </span>`
                } else {
                  
                  getCommits(commits_URL, reponame[0]);
                }

                // Comments
                  getComments(comments_URL);     
             
              }
              )
            
      }
              
      const getCommits = (commits_URL, reponame) => {

          fetch(commits_URL,options)
          .then(res => res.json())
          .then(data => {

            if (data.length > 0) {
              document.getElementById(reponame).innerHTML += data.length;
            } else {
              document.getElementById(reponame).innerHTML += `<span>No commit</span>`;

            }

          })
      }
      

      const getComments = (comments_URL) => {
        console.log(comments_URL)
        fetch(comments_URL,options)
        .then(res => res.json())
        .then(data => console.log(data))
      }


      const gitDashBoard = (project) => {

          if (project.fork === true && reponame.startsWith("project-")) {

            projects.innerHTML += `

            <div class="div" id=${reponame}>
            <h3> ${reponame} </h3>
            <a href=${project.html_url}> Visit </a>
            <span> ${project.default_branch} </span>
            <span> language ${project.language} </span>
            </div>

            `

          } 
      }

