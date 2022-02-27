// List to do
// A list of all repos that are forked ones from Technigo DONE
// Your username and profile picture - DONE
// Most recent update (push) for each repo DONE
// Name of your default branch for each repo - DONE
// URL to the actual GitHub repo - DONE
// Number of commit messages for each repo DONE
// All pull requests DONE
// A chart of how many projects you've done so far, compared to how many you will do using Chart.js. 
// Filter board DONE
// Search Bar DONE 


///////// DOM MANIPULATION //////////
const user = document.querySelector(".user-info");
const projects = document.querySelector("#projects");
const comments = document.querySelector(".comments");
const commits = document.querySelector(".commits");
const closeModal = document.querySelector(".close-modal-btn");
const modalBackground = document.querySelector(".see-more");

const filterBtn = document.getElementById("filter");
const searchBtn = document.getElementById("search");


///////// GLOBAL VARIABLES //////////
let reponame;
let colorNumber = 0;
const colors = ["#F3E0F0", "#D6CDE9"];


///////// ABOUT API //////////
const username = "sukiphan97";
const API_URL = `https://api.github.com/users/${username}/repos`;
const API_TOKEN = TOKEN;


const options = {
    method: "GET",
    headers: {
        Authorization: `token ${API_TOKEN}`
    }
}


///////// FETCH FIRST API TO GET USER INFO AND PROJECTS //////////
    fetch (API_URL)
        .then(res => res.json())
        .then(data => {
          
          //To get data and display user infor
          userInfo(data[0]);

          //To get only projects forked from Technigo
          const datafilter = data.filter(item => item.name.startsWith("project") && item.fork)
          
          // Draw the chart
          updateChart(datafilter.length);
          
          // Adding event to filter button
          filterBtn.addEventListener("change", () => {
            
              // To get access to different option groups 
              const optgroup = filterBtn.options[filterBtn.selectedIndex].parentNode.label;

                if (optgroup === "language") {
                  filterLanguage(datafilter, filterBtn.value);

                } else {
                  filterTime(datafilter)
                }         
            }              
          )

          //////// Search Button ////////
          searchBtn.addEventListener("search", (e) => {

              searchRepo(datafilter, searchBtn.value)
          
            } 
          )

          /////// Generate main dashboard when user reload the page ///////
          data.forEach(project => {
                
              reponame = project.name;
                
              if (datafilter) {
                          
                    gitDashBoard(project)
                    
                        
                }      
          
          })   
            
        })
        

    /////// Function to filter language ///////
    const filterLanguage = (datafilter, language) => {

      projects.innerHTML = "";

      // This variable is to store the filtered value below
      let repoLanguage = [];

      if (language === "JavaScript" || language === "HTML") {

        repoLanguage = datafilter.filter(item =>  item.language === language);

      } else {
        repoLanguage = datafilter;
      }
      
      // To loop over the filtered array and display only selected language
      repoLanguage.forEach(item => {
      
        reponame = item.name;

        gitDashBoard(item);
          
      })
    }
   
    /////// Function to filter lasted-update projects ///////
    const filterTime = (datafilter) => {
      
        // To clear the board before applying new filter
        projects.innerHTML = "";

        // To organize the projects' card from newest to oldes one
        datafilter.sort((a,b) => {

         return new Date(a.pushed_at) < new Date(b.pushed_at) ? 1 : -1; 
          
        })
        
        // Display the filtered card
        datafilter.forEach(item => {

          reponame = item.name;
          gitDashBoard(item);

        })

     
    }
      
    /////// Seach bar ///////
    const searchRepo = (data,input) => {


      projects.innerHTML="";
    
    
      let inputName = input.replaceAll(" ", "-")
      const projectName = data.filter(item =>  item.name === inputName.toLowerCase())
      
      projectName.forEach(item => {
        reponame = item.name;
        gitDashBoard(item);
        getColor(item);
        countTime(item);
        technigoPR(reponame)
      })
    }

    /////// Function to display username and other user info ///////
    const userInfo = (data) => {
         
          const userPicture = data.owner.avatar_url;
          
          user.innerHTML += `
          
          <div class="header-container">
          
            <div>
              <img src=${userPicture}/>
              <a href=${data.owner.html_url} class="user-name"> ${username} </a>
            </div>
              <a href="https://github.com/sukiphan97" class="cta-btn" target="_blank"> CONTACT </a>
          </div>
          
          <h1> Welcome to my Github Tracker <span class="hand-waiving"> 👋 <span></h1> 
          
          `
    }
      
  
    /////// Function to generate project board ///////
    const gitDashBoard = (project) => {
  
          reponame = project.name;
  
          // This condition is to display only forked projects from Technigo
          if (project.fork === true && reponame.startsWith("project-")) {
       
            const repoName = reponame.split("-");
  
            const repoTitle = repoName.map(letter => letter[0].toUpperCase() + letter.slice(1));
            
           // Update HTML 
            projects.innerHTML += `
  
            <div class="repo" id=${reponame}>
           
              <div class="repo-header">
  
                <a class="repo-title" href=${project.html_url}> ${repoTitle.join(" ")} - ${project.default_branch}</a>
  
                <p id="${reponame}-time" class="time">Updated </p>
  
              </div>
  
              <div>
                
                <span class= "${reponame}-language language"> ${project.language} </span>
                
                <button id= "${reponame}-modal-btn" class="open-modal-btn" type="button" > See more </button>
            
              </div>
  
            </div>
  
            `      
        
         }
          
          // All functions to display other datas and style the projects'card
          getColor(project);
          countTime(project);
          styling(project);
          technigoPR(reponame)
  
    }   
  
    
    ///////// FETCH TECHNIGO'S PULL REQUEST //////////
    const technigoPR = (reponame) => {
      
        fetch(`https://api.github.com/repos/Technigo/${reponame}/pulls?per_page=100`, options)
        .then(res => res.json())
        .then(data => {
           
          // Adding event for "See more" button, when user clicks it, a modal will popup
           document.getElementById(`${reponame}-modal-btn`).addEventListener("click", () =>{

            data.forEach(item => {
              
              if (item.user.login === username) {   
                getCommits(item.commits_url, reponame)        
                getComments(item.review_comments_url, reponame)
              } 
              
              else if (item.user.login === "emmahogberg88" && reponame === "project-weather-app") {
                getComments(item.review_comments_url, reponame)
              }

             })
            })
        })
    }

    /////// Function to fetch comments's API link ///////
    const getComments = (comments_url, reponame) => {
      
      fetch(comments_url)
      .then (res => res.json())
      .then (data => {     
        comments.innerHTML = "";
        if (data.length === 0) {
          
          comments.innerHTML = `<p> No comment for this project </p> `

        }  else if (data.length > 0) {
     
          data.forEach(item => comments.innerHTML += `<li> ${item.body} </li>`)
          
        }

        // To remove the hidden class and show the modal
        document.querySelector(".see-more").style.display = "flex";

      })
    }

    /////// Function to fetch commits's API link ///////
    const getCommits = (commits_url, reponame) => {

      fetch(commits_url,options)
      .then(res => res.json())
      .then(data => {

        if (data.length > 0) {
          commits.innerHTML = `📌 Number of commits: ${data.length}`;

        } else {
          commits.innerHTML = `📌 Number of commits: 0`;

        }

      })

    }
       

    /////// Function to count since when the project was updated ///////
      const countTime = (project) => {

        // Get pushed time
        const pushDate = new Date(project.pushed_at);

        // Get current time
        const today = new Date();

        // Count time, seconds, minutes, hours, days
        const sinceTime = (today - pushDate);

        const seconds = Math.round( sinceTime / 1000 );

        const minutes = Math.round( seconds / 60 );

        const hours = Math.round( minutes/60 );

        const days = Math.round( hours/24 );

        const months = Math.round( days/30 ); 


        const updateTime = document.getElementById(`${reponame}-time`);

        //Filter the time and how to display it
        if (minutes < 1) {
          
          updateTime.innerHTML += `${seconds} ago`;
        } 
        else if ( minutes >= 1 && minutes < 60) {

          updateTime.innerHTML += `${minutes} ago`;
        } 
        else if ( minutes >= 60 && hours < 24) {

          updateTime.innerHTML += `${hours} hours ago`;

        } 
        else if (hours >= 24 && days <= 30) {
            
          updateTime.innerHTML += `${days} days ago`;

        }
        else if (days > 30 && months < 12) {

          updateTime.innerHTML += `${months} months ago`;
        } 
        else {

          updateTime.innerHTML += `${sinceTime.toDateString()}`;

        }
      }

    /////// Function apply different colors for the projects'card///////
      const getColor = (project) => {
              
          colorNumber++; 

          if (colorNumber > colors.length - 1) {
            colorNumber = 0; 
          }

          document.getElementById(reponame).style.background = colors[colorNumber];
          
        }
      
    /////// Function style the language tag///////
      const styling = (project) => {
        if(project.language === "JavaScript") {
          document.querySelector(`.${reponame}-language`).style.background = "#7365e5"
        } else {
          document.querySelector(`.${reponame}-language`).style.background = "#333"
        }
  
      }


    /////// Adding event for modal close button///////
      closeModal.addEventListener("click", () => {
        modalBackground.style.display = "none";
      })

      modalBackground.addEventListener("click", () => {
        modalBackground.style.display = "none";

      })


      

     