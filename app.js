const locationsContainer = document.querySelector("#locations");
const departmentsDropdown = document.querySelector("#departmentsdropdown");
const jobsContainer = document.querySelector("#jobscontainer");
const companySelect = document.querySelector(".companySelect")

let locations = [];
let departments = [];
let jobsArray = [];
let selectedLocation = "";
let selectedDepartment = "";

//Company dropdown clears all active filters and calls getJobs function with API url passed as parameter
companySelect.addEventListener("change", () => {
    selectedLocation = "";
    selectedDepartment = "";
    getJobs(companySelect.value);
})

//Changes value of department dropdown and calls selectJobs function to update view
departmentsDropdown.addEventListener("change", () => {
    selectedDepartment = departmentsDropdown.value;
    selectJobs();
})

//Get data from APIs
const getJobs = async (company) => {
    try {
        const res = await fetch(company, { method: "GET" });
        const jobsData = await res.json();
        jobsArray = jobsData.offers;
        createFilters();
    } catch {
        console.log("That didn't work. Try again later");
    }
}

//Creates filters based on jobs data and appends to DOM
const createFilters = () => {

    //clear current location filters
    locations = [];
    locationsContainer.innerHTML = "";

    //add locations to clear locations array
    jobsArray.forEach(job => {
        locations.push(job.city);
    });

    //remove duplicates from locations. First sort alphabetically, then loop through and remove dulplicates
    locations.sort();
    for (let i = 0; i < locations.length; i++) {
        if (locations[i] === locations[i + 1]) {
            locations.splice(i, 1);
            i--;
        } else { }
    }

    //create current department filterts
    departments = [];
    departmentsDropdown.innerHTML = "";

    //add departments to departments array
    jobsArray.forEach(job => {
        departments.push(job.department);

    })

    //remove duplicate departments
    departments.sort();
    for (let j = 0; j < departments.length; j++) {
        if (departments[j] === departments[j + 1]) {
            departments.splice(j, 1);
            j--;
        } else { }
    }

    //Add All button to locations
    const allButton = document.createElement("button");
    allButton.innerHTML = "All";
    allButton.className = "locationButton active"
    allButton.addEventListener("click", () => {
        selectedLocation = "";
        selectJobs();
    })
    locationsContainer.appendChild(allButton);

    //Add All option to dropdown
    const allDepartments = document.createElement("option");
    allDepartments.innerHTML = "All departments";
    allDepartments.value = "";
    departmentsDropdown.appendChild(allDepartments);

    //Add location filters to DOM
    locations.forEach(location => {
        const locationButton = document.createElement("button");
        locationButton.innerHTML = location;
        locationButton.className = "locationButton";
        locationButton.addEventListener("click", () => {
            selectedLocation = location;
            selectJobs();
        })
        locationsContainer.appendChild(locationButton);

    });
    let btns = document.querySelectorAll(".locationButton");


    for (let b = 0; b < btns.length; b++) {

        btns[b].addEventListener("click", function () {
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }

    //Add department filters to DOM
    departments.forEach(department => {
        const departmentItem = document.createElement("option");
        departmentItem.innerHTML = department;
        departmentItem.value = department;
        departmentItem.addEventListener("click", () => {
            selectedDepartment = department;
            selectJobs();
        })
        departmentsDropdown.appendChild(departmentItem);
    });
    selectJobs();
}

//Creates new array based on user selection and passes selection to builder function
const selectJobs = () => {

    if (selectedLocation == "" && selectedDepartment == "") {
        showJobs(jobsArray);
    }

    else if (selectedLocation == "") {

        const jobSelection = jobsArray.filter(job => {
            return job.department == selectedDepartment;
        })
        showJobs(jobSelection);
    }

    else if (selectedDepartment == "") {

        const jobSelection = jobsArray.filter(job => {
            return job.city == selectedLocation;
        })
        showJobs(jobSelection);
    }

    else {
        const jobSelection = jobsArray.filter(job => {
            return job.city == selectedLocation;
        }).filter(job => {
            return job.department == selectedDepartment;
        })
        showJobs(jobSelection);
    }
}

const showJobs = (jobsToShow) => {
    jobsContainer.innerHTML = "";
    jobsToShow.forEach(job => {
        const jobDiv = document.createElement("div");
        jobDiv.className = "jobDiv";
        jobDiv.addEventListener("click", () => {
            window.open(job.careers_url, "_black")
        })
        const jobTitle = document.createElement("h4");
        jobTitle.innerHTML = job.title;
        jobTitle.className = "jobTitle";
        const jobLocation = document.createElement("p");
        jobLocation.innerHTML = job.location;
        jobLocation.className = "jobLocation";
        const jobDepartment = document.createElement("p");
        jobDepartment.innerHTML = job.department;
        jobDepartment.className = "jobDepartments";
        jobDiv.appendChild(jobTitle);
        jobDiv.appendChild(jobLocation);
        jobDiv.appendChild(jobDepartment);
        jobsContainer.appendChild(jobDiv);
    })
}

getJobs("https://5ca.recruitee.com/api/offers")