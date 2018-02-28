/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    //document.getElementById("myText").value = e.target.textContent;
    var text = "";

    function LogTabs(tabs) {

      for (let tab of tabs) {
        text = text + tab.url + "\n";
      }

      document.getElementById("myText").value = text;

      CheckIfRemovedEnabled();

    }

    function CheckIfRemovedEnabled() {
      if (document.getElementById("checkbox").checked) {
        browser.tabs.query({ currentWindow: true }, CloseAllTabs);
        document.getElementById("checkbox").checked = false;
      }
    }

    function onError(error) {
      console.log(`Error: ${error}`);
    }

    function ValidURL(str) {
      var pattern = new RegExp('^(https?:\/\/)?' + // protocol
        '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // domain name
        '((\d{1,3}\.){3}\d{1,3}))' + // OR ip (v4) address
        '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // port and path
        '(\?[;&a-z\d%_.~+=-]*)?' + // query string
        '(\#[-a-z\d_]*)?$', 'i'); // fragment locater
      if (!pattern.test(str)) {
        alert("Please enter a valid URL.");
        return false;
      } else {
        return true;
      }
    }

    function validURL(str) {
      if (str.length > 6) {
        console.log(str.substr(0, 6));
        return (str.substr(0, 6).includes("http"));
      }
    }

    function CloseAllTabs(tabs) {
      //browser.tabs.create({ url: "https://www.msn.com/spartan/dhp?locale=en-US&market=US&enableregulatorypsm=0&enablecpsm=0&ishostisolationenforced=0&targetexperience=default" });

      browser.tabs.query({currentWindow: true, active:true}, function(curr) {
        for (let tab of tabs) {
          //Current window true and active true will return the curent active window and then return an aray for the funciton.
          if (curr[0].id != tab.id) {
            browser.tabs.remove(tab.id);
          }

          browser.tabs.update (curr[0].id, {url: "https://www.msn.com/spartan/dhp?locale=en-US&market=US&enableregulatorypsm=0&enablecpsm=0&ishostisolationenforced=0&targetexperience=default"});
        }
      });

    }

    function RenderTabs() {

      CheckIfRemovedEnabled();

      var text = document.getElementById("myText").value;
      var links = text.split("\n");

      for (let link of links) {
        if (validURL(link)) {
          browser.tabs.create({ url: link });
        }
      }

      document.getElementById("myText").value = "";

    }

    if (e.target.textContent == "Get Links") {
      var querying = browser.tabs.query({ currentWindow: true }, LogTabs);
    } else if (e.target.textContent == "Put Links") {
      RenderTabs();
    } else if (e.target.textContent == "Close All") {
      var querying = browser.tabs.query({ currentWindow: true }, CloseAllTabs);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
listenForClicks();