console.log("This is a popup!");

// if there is any highlghted text, add it to the popup html

if (window.getSelection().toString() !== "") {
  document.getElementById("highlightedText").innerHTML = window.getSelection().toString();
} else {
  alert("Please highlight some text to add it to the popup!");
}


