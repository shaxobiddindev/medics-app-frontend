// Loader
window.addEventListener('load', function () {
  setTimeout(showPage, 1500); // 3 soniya kutamiz
});

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

//======================================================================
